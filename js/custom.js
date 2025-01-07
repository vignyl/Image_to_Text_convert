window.addEventListener("load", async () => {
	// I GET A HTML ELEMENT
   //test();
	const inputFile = document.getElementById("input_file");
	const resultTextContent = document.getElementById("result_file_content");
	var pages = [];
	// CREATE ENGLISH WORKER (NEED TO SPECIFY LANGUAGE BY USER)
	const worker = await Tesseract.createWorker();
	await worker.loadLanguage("eng");
	await worker.initialize("eng");

	inputFile.onchange = async () => {

		for (let i = 0; i < inputFile.files.length; i++) {
		    const res = await imgToTextFromLine(worker, inputFile.files[i]);
			pages.push(res);
			resultTextContent.innerHTML += res;
		}
		//console.log("pages", pages);
 		createPdf(pages);
	}
});

var imgToText =  async (worker, file) => {
	const res = await worker.recognize(file);
	//console.log("imgToText", res);
	var text = res.data.text;
	//text = text.replace(/\n/g,'<br/>');
	return text;
};

var imgToTextFromLine =  async (worker, file) => {
	const res = await worker.recognize(file);
	//console.log("imgToText", res);
	var txt = "";
	res.data.lines.forEach((l, i) => { 
		txt += prependSpace(102, l.bbox.x0, l.text);
	});
	//var text = res.data.text;
	//text = text.replace(/\n/g,'<br/>');
	return txt;
};

var createPdf =  async (pages) => {
	var doc = new jsPDF(); 
	//console.log("getFontList", doc.getFontList());
	doc.setFont("times", "normal"); 
	doc.setFontStyle("Roman");
	doc.setFontSize(10);

	pages.forEach((v, i) => {  
		doc.text(v, 40, 30,/*{align: "justify" lineHeightFactor: 1.5}*/);
		doc.setPage(i+1);
		console.log("Page", (i+1));
		doc.text((i+1) +'/' + pages.length, 210-20, 297-20, null, null, "right");
		if(pages.length - 1 > i) doc.addPage(); 
	});

	doc.save("sample-file.pdf");
};

var prependSpace = (startSpace, space, str) => {
	var diff = space - startSpace - 170;
	if(diff > 0) {
	//console.log("diff", diff);  
		return ' '.repeat(50) + str;
	}
	else return str;
};

var test =  async () => {
	var doc = new jsPDF(); 
	console.log("getFontList", doc.getFontList());  
	doc.setFont("times", "normal"); 
	doc.setFontStyle("Roman");
	doc.text("sample-file.pdf", 40, 30,/*{align: "justify" lineHeightFactor: 1.5}*/);
	doc.save("sample-file.pdf");
};