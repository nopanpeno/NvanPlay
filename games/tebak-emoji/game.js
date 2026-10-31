(function(){
const questions=[
{emoji:"☀️ 🌻",hint:"Bunga yang selalu menghadap matahari",answer:"Bunga matahari",other:["Bunga mawar","Pohon kelapa","Matahari terbit"]},
{emoji:"🐢 🏃",hint:"Ungkapan tentang menang karena konsisten",answer:"Pelan-pelan asal selamat",other:["Buah jatuh tak jauh","Besar pasak daripada tiang","Ada udang di balik batu"]},
{emoji:"🍚 🍳",hint:"Menu sarapan sederhana",answer:"Nasi goreng",other:["Soto ayam","Roti bakar","Mie rebus"]},
{emoji:"🌧️ 🐈 🐕",hint:"Hujan yang sangat deras",answer:"Hujan deras",other:["Gerimis sore","Angin sepoi-sepoi","Pelangi pagi"]},
{emoji:"📚 🐛",hint:"Orang yang gemar membaca",answer:"Kutu buku",other:["Buku harian","Pustakawan","Penulis cerita"]},
{emoji:"🦶 🏔️",hint:"Berjalan jauh untuk menikmati alam",answer:"Naik gunung",other:["Lari pagi","Panjat tebing","Jalan-jalan"]},
{emoji:"🧊 ☕",hint:"Minuman kopi yang disajikan dingin",answer:"Es kopi",other:["Kopi tubruk","Teh tarik","Cokelat panas"]},
{emoji:"🐊 💧",hint:"Air mata yang dibuat-buat",answer:"Air mata buaya",other:["Buaya darat","Hati yang dingin","Lautan luas"]},
{emoji:"🎂 🕯️ 🎉",hint:"Perayaan tahunan seseorang",answer:"Ulang tahun",other:["Tahun baru","Pesta kejutan","Hari libur"]},
{emoji:"🌙 😴",hint:"Ucapan sebelum tidur",answer:"Selamat malam",other:["Selamat pagi","Sampai jumpa","Selamat makan"]},
{emoji:"🌊 🏄",hint:"Olahraga di atas papan di laut",answer:"Selancar",other:["Renang","Menyelam","Mendayung"]},
{emoji:"🏠 🔑",hint:"Tempat orang tinggal",answer:"Rumah",other:["Kantor","Sekolah","Pasar"]},
{emoji:"🌧️ ☂️",hint:"Saran saat hujan turun",answer:"Bawa payung",other:["Pakai topi","Berjemur","Naik sepeda"]},
{emoji:"✈️ 🌏",hint:"Pergi jauh dengan pesawat",answer:"Terbang jauh",other:["Naik kereta","Naik bus","Jalan kaki"]},
{emoji:"🦷 🪥",hint:"Kebiasaan pagi dan malam",answer:"Sikat gigi",other:["Cuci muka","Mandi","Sarapan"]},
{emoji:"📖 ✏️",hint:"Kegiatan di sekolah",answer:"Belajar",other:["Bermain","Tidur","Makan"]},
{emoji:"⚽ 🥅",hint:"Olahraga tim dengan gawang",answer:"Sepak bola",other:["Bola basket","Tenis","Voli"]},
{emoji:"🍜 🌶️",hint:"Makanan berkuah dan pedas",answer:"Mie pedas",other:["Bakso","Sate","Gado-gado"]},
{emoji:"🎤 🎶",hint:"Acara musik besar",answer:"Konser",other:["Bioskop","Pameran","Pesta"]},
{emoji:"🌙 ⭐",hint:"Suasana langit gelap penuh bintang",answer:"Malam berbintang",other:["Pagi cerah","Siang panas","Sore berawan"]},
{emoji:"🐒 🍌",hint:"Hewan yang suka buah pisang",answer:"Monyet",other:["Kuda","Kelinci","Burung"]},
{emoji:"🧹 🏠",hint:"Kegiatan membersihkan rumah",answer:"Bersih-bersih",other:["Memasak","Berkebun","Melukis"]},
{emoji:"🚲 🌳",hint:"Olahraga santai di luar ruangan",answer:"Bersepeda di taman",other:["Berenang","Berlari","Memanjat"]}
];
const $=s=>document.querySelector(s),el={progress:$("#progress"),score:$("#score"),clue:$("#clue"),hint:$("#hint"),choices:$("#choices"),status:$("#status"),next:$("#next"),restart:$("#restart"),best:$("#best")};let order=[],index=0,score=0,answered=false,best=0;
function loadBest(){best=Number(window.nvanplayStorage.getItem("tebak-emoji:best",0))||0;el.best.textContent=best}
function shuffle(a){return a.slice().sort(()=>Math.random()-.5)}
function show(){answered=false;const q=questions[order[index]];el.progress.textContent="Soal "+(index+1)+"/"+questions.length;el.score.textContent=score;el.clue.textContent=q.emoji;el.hint.textContent=q.hint;el.status.textContent="Pilih jawaban yang paling cocok.";el.next.hidden=true;el.choices.replaceChildren();shuffle([q.answer,...q.other]).forEach(answer=>{const b=document.createElement("button");b.type="button";b.className="choice";b.textContent=answer;b.addEventListener("click",()=>choose(b,answer===q.answer,q.answer));el.choices.append(b)})}
function choose(button,correct,answer){if(answered)return;answered=true;el.choices.querySelectorAll("button").forEach(b=>{b.disabled=true;if(b.textContent===answer)b.classList.add("correct")});if(correct){score++;el.status.textContent="Betul! Mantap 🎉"}else{button.classList.add("wrong");el.status.textContent="Belum tepat. Jawabannya: "+answer}el.score.textContent=score;el.next.hidden=false}
function finish(){el.choices.replaceChildren();el.clue.textContent="🏁";el.hint.textContent="Semua soal selesai.";el.status.textContent="Skormu "+score+" dari "+questions.length+".";el.progress.textContent="Selesai";el.next.hidden=true;el.restart.hidden=false;if(score>best){best=score;window.nvanplayStorage.setItem("tebak-emoji:best",best);el.best.textContent=best}}
function start(){order=shuffle(questions.map((_,i)=>i));index=0;score=0;el.restart.hidden=true;show()}
el.next.addEventListener("click",()=>{index++;index<questions.length?show():finish()});el.restart.addEventListener("click",start);loadBest();start();
})();