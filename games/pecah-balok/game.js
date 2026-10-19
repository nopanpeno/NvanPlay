(function(){
const canvas=document.querySelector("#arena"),ctx=canvas.getContext("2d"),scoreNode=document.querySelector("#score"),livesNode=document.querySelector("#lives"),bestNode=document.querySelector("#best"),status=document.querySelector("#status"),startButton=document.querySelector("#start");
const W=480,H=360,cols=8,rows=5,brickW=50,brickH=17,gap=7,offsetX=13,offsetY=32,paddle={x:W/2-42,y:H-27,w:84,h:10},ball={x:W/2,y:H-42,r:7,vx:3.2,vy:-3.5};
const colors=["#ff595e","#ff924c","#ffca3a","#8ac926","#1982c4"];
let bricks=[],score=0,lives=3,best=Number(window.nvanplayStorage.get("pecah-balok:best",0))||0,active=false,launched=false,keys={},raf=0;
bestNode.textContent=best;
function makeBricks(){bricks=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)bricks.push({x:offsetX+c*(brickW+gap),y:offsetY+r*(brickH+gap),alive:true,color:colors[r%colors.length]})}
function draw(){ctx.clearRect(0,0,W,H);bricks.forEach(b=>{if(!b.alive)return;ctx.fillStyle=b.color;ctx.fillRect(b.x,b.y,brickW,brickH);ctx.strokeStyle="rgba(16,21,37,.45)";ctx.lineWidth=2;ctx.strokeRect(b.x+1,b.y+1,brickW-2,brickH-2)});ctx.fillStyle="#f8fafc";ctx.fillRect(paddle.x,paddle.y,paddle.w,paddle.h);ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill()}
function updateBest(){if(score>best){best=score;bestNode.textContent=best;window.nvanplayStorage.set("pecah-balok:best",best)}}
function serve(){ball.x=paddle.x+paddle.w/2;ball.y=paddle.y-ball.r-2;ball.vx=3.2;ball.vy=-3.5;launched=false}
function end(text){active=false;cancelAnimationFrame(raf);status.textContent=text;startButton.disabled=false;draw()}
function tick(){if(!active)return;const oldX=ball.x,oldY=ball.y;if(keys.ArrowLeft||keys.KeyA)paddle.x-=6;if(keys.ArrowRight||keys.KeyD)paddle.x+=6;paddle.x=Math.max(0,Math.min(W-paddle.w,paddle.x));if(!launched)serve();else{ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x<ball.r||ball.x>W-ball.r)ball.vx*=-1;if(ball.y<ball.r)ball.vy=Math.abs(ball.vy);
if(ball.vy>0&&ball.y+ball.r>=paddle.y&&oldY+ball.r<=paddle.y&&ball.x>=paddle.x&&ball.x<=paddle.x+paddle.w){const impact=(ball.x-(paddle.x+paddle.w/2))/(paddle.w/2);ball.vx=impact*4.7;ball.vy=-Math.max(2.8,Math.abs(ball.vy));ball.y=paddle.y-ball.r}
for(const b of bricks){if(!b.alive)continue;if(ball.x+ball.r>b.x&&ball.x-ball.r<b.x+brickW&&ball.y+ball.r>b.y&&ball.y-ball.r<b.y+brickH){b.alive=false;score+=10;scoreNode.textContent=score;updateBest();if(oldY+ball.r<=b.y||oldY-ball.r>=b.y+brickH)ball.vy*=-1;else ball.vx*=-1;break}}
if(bricks.every(b=>!b.alive)){end("Semua balok pecah! Kamu menang 🎉");return}
if(ball.y>H+ball.r){lives--;livesNode.textContent=lives;if(lives<=0){end("Nyawa habis. Skor akhir: "+score+". Tekan Mulai untuk mencoba lagi.");return}serve();status.textContent="Bola jatuh. Tekan Spasi atau ketuk arena untuk meluncurkan lagi."}
}draw();raf=requestAnimationFrame(tick)}
function start(){if(active)return;if(lives===0||bricks.every(b=>!b.alive)){score=0;lives=3;scoreNode.textContent=score;livesNode.textContent=lives;makeBricks();serve()}active=true;startButton.disabled=true;status.textContent=launched?"Teruskan!":"Ketuk arena atau tekan Spasi untuk meluncurkan bola.";raf=requestAnimationFrame(tick)}
function launch(){if(!active)start();if(!launched){launched=true;status.textContent="Jaga bolanya tetap di arena!"}}
function movePointer(e){const rect=canvas.getBoundingClientRect();paddle.x=Math.max(0,Math.min(W-paddle.w,((e.clientX-rect.left)/rect.width)*W-paddle.w/2));if(!launched)serve()}
canvas.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse"||e.buttons)movePointer(e)});canvas.addEventListener("pointerdown",e=>{e.preventDefault();movePointer(e);launch()});startButton.addEventListener("click",start);
document.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","Space"].includes(e.code))e.preventDefault();keys[e.code]=true;if(e.code==="Space")launch()});document.addEventListener("keyup",e=>{keys[e.code]=false});
makeBricks();serve();draw();
})();