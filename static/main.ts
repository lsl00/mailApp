const idmail : HTMLInputElement = document.querySelector("input[name='IDmail']");
const idinfo : HTMLInputElement = document.querySelector("input[name='IDinfo']");
const subjectE : HTMLInputElement = document.querySelector("input[name='subject']");
const fromE : HTMLInputElement = document.querySelector("input[name='from']");
const temp : HTMLTextAreaElement= document.querySelector("textarea");
const which : HTMLSelectElement = document.querySelector("#whichid"); //select

const host : HTMLInputElement = document.querySelector("input[name='Host']");
const user : HTMLInputElement = document.querySelector("input[name='User']");
const pass : HTMLInputElement = document.querySelector("input[name='Pass']");
const sendto : HTMLSpanElement = document.querySelector("#sendto");
const preview : HTMLTextAreaElement = document.querySelector("#preview");
const config : HTMLInputElement = document.querySelector("#config");
config.addEventListener("change",(e) => {
	if(!config.files) return;
	let f = config.files[0];
	f.slice()
	 .text()
	 .then(t => JSON.parse(t))
	 .then(obj => {
		host.value = obj['hostname']??host.value;
		user.value = obj['username']??user.value;
		pass.value = obj['password']??pass.value;
		subjectE.value = obj['subject']??subjectE.value;
		fromE.value = obj['from']??fromE.value;
		temp.value = obj['template']??temp.value;
	 })
})
class item{
	what : boolean; //true时为替换项
	str : string | null;
	column : number | null;

	constructor(b : boolean,s : string|null,c : number | null){
		this.what = b;
		this.str = s;
		this.column = c;
	}
}
function parse(s : string) : item[]{
	let result : item[] = [];
	let length = s.length;
	let begin = 0,end = 0;
	while(end < length){


		if(s.charAt(end) != '%') {
			end++;
			continue;
		}
		if(begin < end){
			result.push(new item(false,s.substring(begin,end),null));
		}
		end = end + 1;
		begin = end;

		while(end < length){
			if(s.charAt(end) != '%') {
				end++;
				continue;
			}
			break;
		}

		if(begin == end){
			result.push(new item(false,'%',null));
		}else{
			let subs = s.substring(begin,end);
			let col = parseInt(subs);
			result.push(new item(true,null,col));
		}
		end = end + 1;
		begin = end;
	}
	if(begin != end) result.push(new item(false,s.substring(begin),null));
	return result;
}

function generate(template : item[],a : string[]) : string{
	return template.map((it) => {
		if(it.what && it.column){
			return a[it.column];
		}else{
			return it.str;
		}
	}).join("");
}
function parseCSV(s : string) : string[][]{
	let x = s.split('\n');
	return x.map(s => s.trim().split(','));
}

function SendAll(){
	const hostname = host.value;
	const username = user.value;
	const password = pass.value;
	const subject = subjectE.value;
	const from = fromE.value;
	mails.forEach((m,id) => {
		let line = contents.get(id);
		if(line != null){
			let content = generate(template,line);
			fetch("/send",{
				method : "POST",
				headers : {
					'Content-Type' : 'application/json'
				},
				body : JSON.stringify({
					hostname,
					username,
					password,
					from,
					subject,
					content,
					to : m
				})
			})
			.then(resp => resp.text())
			.then(value => console.log("Send to ",m,value));
		}
	})
}
async function FromFile(f : File) : Promise<string[][]> {
	return f.slice().text()
			.then(t => parseCSV(t));
}

var mails = new Map<string,string>();
var contents = new Map<string,string[]>();
var template : item[];
which.addEventListener("change",()=>{
	const currentWho = which.value;
	console.log(currentWho);
	sendto.innerText = mails.get(currentWho)??"";
	console.log(contents.get(currentWho));
	preview.innerText = generate(template,contents.get(currentWho));
})

async function view() {
	const mail = await FromFile(idmail.files[0]);
	const infos = await FromFile(idinfo.files[0]);
	mails.clear();
	contents.clear();
	mail.forEach(e => {
		mails.set(e[0],e[1]);
	})
	infos.forEach(e => {
		contents.set(e[0],e);
	})
	template = parse(temp.value);
	console.log(template);
	mails.forEach((v,id) => {
		if(!contents.has(id)) return;
		let e = document.createElement("option");
		e.setAttribute("value",id);
		e.innerText = id;
		which.appendChild(e);
	})
	const currentWho = which.value;
	sendto.innerText = mails.get(currentWho)??"";
	preview.innerText = generate(template,contents.get(currentWho));
}

function Preview(){
	view().then()
}
function test(){
	let temp = parse("balaba%1%%%ndsao%2%d%%");
	parseCSV("1,2,3\n4,5,6\n7,8,9").forEach(element => {
		console.log(generate(temp,element));
	});
	
}
