(function(){
const boardEl=document.querySelector("#board"),movesEl=document.querySelector("#moves"),status=document.querySelector("#status");
let board=[],moves=0,won=false;
function solved(){return Array.from({length:16},(_,i)=>(i+1)%16)}
function neighbors(index){const row=Math.floor(index/4),col=index%4;return [[row-1,col],[row+1,col],[row,col-1],[row,col+1]].filter(([r,c])=>r>=0&&r<4&&c>=0&&c<4).map(([r,c])=>r*4+c)}
function draw(){boardEl.replaceChildren();board.forEach((value,index)=>{const tile=document.createElement("button");tile.type="button";tile.className="tile";tile.setAttribute("role","gridcell");tile.textContent=value||"";tile.disabled=won||value===0;tile.setAttribute("aria-label",value?"Keping "+value:"Ruang kosong");tile.addEventListener("click",()=>move(index));boardEl.append(tile)})}
function isSolved(){return board.every((value,index)=>value===(index+1)%16)}
function move(index){if(won)return;const empty=board.indexOf(0);if(!neighbors(empty).includes(index)){status.textContent="Pilih keping yang berdampingan dengan ruang kosong.";return}[board[empty],board[index]]=[board[index],board[empty]];moves++;movesEl.textContent=moves;if(isSolved()){won=true;status.textContent="Berhasil! Puzzle selesai dalam "+moves+" langkah 🎉"}else status.textContent="Terus susun angkanya.";draw()}
function shuffleBoard(){board=solved();let empty=15,previous=-1;for(let n=0;n<180;n++){const options=neighbors(empty).filter(i=>i!==previous);const next=options[Math.floor(Math.random()*options.length)];[board[empty],board[next]]=[board[next],board[empty]];previous=empty;empty=next}if(isSolved())return shuffleBoard();moves=0;won=false;movesEl.textContent="0";status.textContent="Ketuk keping di sebelah ruang kosong.";draw()}
document.addEventListener("keydown",e=>{const direction={ArrowUp:-4,ArrowDown:4,ArrowLeft:-1,ArrowRight:1}[e.key];if(!direction)return;e.preventDefault();const empty=board.indexOf(0),next=empty+direction;if(next<0||next>15)return;if(Math.abs(direction)===1&&Math.floor(next/4)!==Math.floor(empty/4))return;move(next)});
document.querySelector("#shuffle").addEventListener("click",shuffleBoard);shuffleBoard();
})();