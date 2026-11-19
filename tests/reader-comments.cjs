const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const requests=[];
let now=1;
const client={fetchGet(url,params,ok,fail){
  const task={params,ok,fail,cancelled:false,abort(){this.cancelled=true;}};requests.push(task);return task;
}};
const out={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/reader-comment-feed.js'),'utf8'),{
  Date:{now:()=>now},__d(fn){fn({},i=>[{default:client},{API_FORUM_LIST:'forum'}][i],null,null,null,out,[0,1]);}
});
const feed=out.create('abc'),last=()=>requests.at(-1);
function respond(task,ids,total){
  task.ok({code:200,data:{total,list:ids.map(CID=>({CID}))}});
}
assert.equal(requests.length,0);
const drafts=out.create('chapter-drafts');
drafts.selectReply('a');drafts.editReply('第一条');
drafts.selectReply('b');drafts.editReply('第二条');
drafts.selectReply('a');assert.equal(drafts.get().replyText,'第一条');
const failed=drafts.beginReply();assert.equal(drafts.beginReply(),null);
drafts.finishReply(failed,false,'offline');assert.equal(drafts.get().replyText,'第一条');
drafts.discardReply();drafts.selectReply('a');assert.equal(drafts.get().replyText,'');
drafts.selectReply('b');assert.equal(drafts.get().replyText,'第二条');
const previous=drafts.beginReply();drafts.clearDrafts();drafts.selectReply('b');
assert.equal(drafts.get().replyText,'');drafts.editReply('新回复');
drafts.finishReply(previous,true);assert.equal(drafts.get().replyText,'新回复');
drafts.finishReply(drafts.beginReply(),true);drafts.selectReply('b');assert.equal(drafts.get().replyText,'');
drafts.editReply('仅在本章');drafts.dispose();drafts.selectReply('b');assert.equal(drafts.get().replyText,'');
requests.length=0;
feed.load('open');feed.load('open');assert.equal(requests.length,1);
assert.equal(last().params.aid,'abc');respond(last(),[1,2],4);
feed.load('open');assert.equal(requests.length,1);
feed.load('more');assert.equal(last().params.page,2);
last().fail();assert.equal(feed.get().items.length,2);assert.equal(feed.get().error,2);
feed.load('more');respond(last(),[2,3,4],4);
assert.equal(feed.get().items.length,4);assert.equal(feed.get().more,false);
feed.load('more');assert.equal(requests.length,3);
now+=125000;feed.load('open');const stale=last();
feed.load('refresh');assert.equal(stale.cancelled,true);respond(stale,[90],1);
assert.equal(feed.get().items.length,4);respond(last(),[],0);
assert.equal(feed.get().items.length,0);assert.equal(feed.get().more,false);
feed.load('refresh');last().ok({code:200,data:{}});assert.equal(feed.get().error,1);
feed.load('refresh');const late=last();feed.dispose();respond(late,[99],1);assert(late.cancelled);assert.equal(feed.get().items.length,0);
console.log('Reader comment feed passed lazy loading, reuse, pagination, refresh, error and disposal checks');
