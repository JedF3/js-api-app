//#region initialization of global variables
const AI_API_KEY = "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";
const AI_API_URL = "https://api.openai.com/v1/chat/completions";
const articleAPIEndpoint = "https://js-api-app-backend.vercel.app/api/v1/news";
const assetsEndpoint="https://api.coincap.io/v2/assets";
let coinDropdown=document.getElementById("symbols");
let chatHistory=[{"role":"assistant", "content": "Hello! I am your assistant. How may I help you today?"}];
let leftDiv=document.querySelector(".leftContent");
let btcprice=document.querySelector(".btcprice");
let btcsupply=document.querySelector(".btcsupply");
let btcvolume=document.querySelector(".btcvolume");
let ethprice=document.querySelector(".ethprice");
let ethsupply=document.querySelector(".ethsupply");
let ethvolume=document.querySelector(".ethvolume");
let otherUSDDiv=document.getElementsByClassName("otherusdprices");
let infoHeader=document.querySelector(".infoHeader");
let slideIndex=0;
let lastOtherIndex=5;
let slideImages = document.getElementsByClassName("slideItem");
let prevButton = document.getElementById("previousSlide");
let nextButton = document.getElementById("nextSlide");
let slideNavigatorDiv = document.querySelector(".slideNav");
let slideTitleLink=document.getElementById("slideArticleLink");
let articleTitleDiv=document.querySelector(".articleLinkDiv");
let slideArticleTitles=[];
let slideArticleLinks=[];
let slideArticleAuthors=[];
let slideArticleSources=[];
let slideAuthor=document.querySelector(".author");
let slideSource=document.querySelector(".source");
let coinOptions=[];
let coinSymbols=[];
let userChatMotherDiv=[];
let userChatDiv=[];
let userChat=[];
let assistChatMotherDiv=[];
let assistChatDiv=[];
let assistChat=[];
let userimg;
let assistimg;
let Assetdata;
let chatHistoryWindow=document.querySelector(".chatHistory");
let userInput = document.querySelector(".aiInput");
let positive = document.createElement("p");
let negative = document.createElement("p");
let otherUSDIndex=0;
let otherArticlePageIndex=0;
let tempTitle;
let articleList = document.getElementsByClassName("otherArticleLinks");
let pageDisplay = document.getElementById("pageNum");
let previousArticleButton = document.querySelector(".prevPageButton");
let nextArticleButton = document.querySelector(".nextPageButton");
let scrollPrices=document.querySelector(".topTen");
let scrollPriceText="";
//#endregion

//#region dom attribute settings, eventListeners, display styles and auto slideshow interval
positive.className="green";
positive.innerText="▲"
negative.className="red";
negative.innerText="▼"
slideNavigatorDiv.style.display="none"; //hide until page is loaded
articleTitleDiv.style.display="none"; //hide until page is loaded
userimg=document.createElement("img");
userimg.src="img/user_profile_pic.png";
userimg.className="profileimg";

//#region setting the first assistant message
assistimg=document.createElement("img");
assistimg.src="img/assistant_profile_pic.png";
assistimg.className="profileimg";
assistChatMotherDiv.push(document.createElement("div"));
assistChatDiv.push(document.createElement("div"));
assistChat.push(document.createElement("p"));
assistChat[0].innerText=chatHistory[0].content;
assistChat[0].className="commonFont commonColor"
assistChatDiv[0].appendChild(assistChat[0]);
assistChatDiv[0].className="fromAssistDiv commonFont commonColor";
assistChatMotherDiv[0].className="fromAssistMotherDiv";
assistChatMotherDiv[0].appendChild(assistimg.cloneNode(true));
assistChatMotherDiv[0].appendChild(assistChatDiv[0]);
chatHistoryWindow.appendChild(assistChatMotherDiv[0]);
//#endregion

//#region eventListeners
prevButton.addEventListener("click", ()=>{slideNavigate(-1)});
nextButton.addEventListener("click", ()=>{slideNavigate(1)});
userInput.addEventListener("keydown", (event)=>{
  if(event.key=="Enter"){
    userChatMotherDiv.push(document.createElement("div"));
    userChatDiv.push(document.createElement("div"));
    userChat.push(document.createElement("p"))
    let index=userChat.length-1;
    userChat[index].innerText=userInput.value;
    userChat[index].className="commonFont commonColor"
    userChatDiv[index].appendChild(userChat[index]);
    userChatDiv[index].className="userChatDiv";
    userChatMotherDiv[index].appendChild(userChatDiv[index]);
    userChatMotherDiv[index].appendChild(userimg.cloneNode(true));
    userChatMotherDiv[index].className=("userMotherDiv");
    chatHistoryWindow.appendChild(userChatMotherDiv[index]);
    chatHistory.push({"role":"system","content":userInput.value});
    sendMessage(chatHistory);
    chatHistoryWindow.scrollTo(0, chatHistoryWindow.scrollHeight);
    userInput.value="";
    userInput.setSelectionRange(0,0);
  }
});
//#endregion
setInterval(()=>{slideNavigate(1);},10000); //automatically make the news slide go next after 10 seconds
//#endregion

//#region navigation helper function
function slideNavigate(moveIndex){ 
  displayLatest(moveIndex);
}
//#endregion 

//#region display and navigation function
function displayLatest(index){ 
  slideIndex+=index;
  if(slideIndex>=5){
    slideIndex=0;
  }
  if(slideIndex<0){
    slideIndex=4;
  }
  for(let i =0; i<5; i++){
    slideImages[i].style.display="none";
  }
  slideImages[slideIndex].style.display="block";
  slideTitleLink.innerText=slideArticleTitles[slideIndex];
  slideTitleLink.href=slideArticleLinks[slideIndex];
  slideAuthor.innerText="Author: "+slideArticleAuthors[slideIndex];
  slideSource.innerText=" Source:  "+slideArticleSources[slideIndex];
}
//#endregion

//#region trim article title text
function trimTitle(text, limit){
  if(text.length>limit){
    return text.slice(0, limit)+"..."
  }
  return text;
}
//#endregion

//#region display lower article list section and pagination
function displayOtherArticles(response, pageCounter=0, articleCounter=5){
  if(articleCounter<5&&pageCounter==-1||articleCounter>104&&pageCounter==1){ //stop navigation when there are no more articles
    return;
  }
  if(!(otherArticlePageIndex+pageCounter<0 || otherArticlePageIndex+pageCounter>11)){
    function populateOtherArticles(){
      for(let i = 0; i<10;i++){
        if(i+articleCounter<100){
          tempTitle=trimTitle(response.articles.articles[i+articleCounter].title, 77);
          articleList[i].href=response.articles.articles[i+articleCounter].url;
          articleList[i].innerText=tempTitle;
        }
        else{
          articleList[i].href="";
          articleList[i].innerText="";
        }
      }
    }
    if(pageCounter>=0){
      populateOtherArticles();
    }  
    else{
      articleCounter=articleCounter+(pageCounter*20);
      populateOtherArticles();
    }
    pageDisplay.value=otherArticlePageIndex+pageCounter+1;
    lastOtherIndex=pageCounter!=0?(lastOtherIndex+(10*pageCounter)):15;
    otherArticlePageIndex+=pageCounter;
  }
}
//#endregion 

//#region get news
const getArticles = async ()=>{
  const response = await fetch(articleAPIEndpoint, {
    method:"GET"
  });
  return response.json();
}
//#endregion 

//#region get coin prices and market info
const getAssetInfo = async ()=>{
  const response = await fetch(assetsEndpoint, {
    method:"GET"
  });
  return response.json();
}
//#endregion

const updateAssetInfo = async (updEndpoint)=>{
  const response = await fetch(updEndpoint, {
    method:"GET"
  });
  return response.json();
}

const updateScrollInfo = async (scrollEndpoint)=>{
  const response = await fetch(scrollEndpoint, {
    method:"GET"
  });
  return response.json();
}


//#region send OpenAI a message
async function sendMessage(msg){
  const response = await fetch(`${AI_API_URL}`,{
    method: 'POST',
    headers:{
      "Content-Type": "application/json",
      "Authorization": `Bearer ${AI_API_KEY}`
    },
    body: JSON.stringify(
      {
        model:"gpt-3.5-turbo",
        messages:msg
      }
    )
  });
  const data = await response.json();
  let responseMessage = data.choices[0].message
  assistChatMotherDiv.push(document.createElement("div"));
  assistChatDiv.push(document.createElement("div"));
  assistChat.push(document.createElement("p"));
  let index=assistChatDiv.length-1;
  assistChat[index].innerText=responseMessage.content;
  assistChatDiv[index].className="fromAssistDiv commonFont commonColor";
  assistChatDiv[index].appendChild(assistChat[index]);
  assistChatMotherDiv[index].appendChild(assistimg.cloneNode(true));
  assistChatMotherDiv[index].appendChild(assistChatDiv[index]);
  assistChatMotherDiv[index].className="fromAssistMotherDiv";
  chatHistoryWindow.appendChild(assistChatMotherDiv[index]);
  chatHistoryWindow.scrollTo(0, chatHistoryWindow.scrollHeight);
}
//#endregion

setTimeout(()=>{
  let load = document.querySelector(".loadingScreen");
  load.style.display="none";
}, 3000);

//#region set coin prices
getAssetInfo().then((response)=>{
  Assetdata=response.data;
  let dataLength=Assetdata.length;
  let btcData=Assetdata.find((element)=>element.symbol=="BTC");
  let ethData=Assetdata.find((element)=>element.symbol=="ETH");
  let dynData=new Array(4);
  let btcArrow = Number(btcData.changePercent24Hr)>0?positive.cloneNode(true):negative.cloneNode(true);
  let ethArrow = Number(ethData.changePercent24Hr)>0?positive.cloneNode(true):negative.cloneNode(true);
  btcprice.innerText="Price USD: "+Number(btcData.priceUsd).toFixed(2);
  btcprice.appendChild(btcArrow);
  btcsupply.innerText="Supply: "+Number(btcData.supply).toFixed(2);
  btcvolume.innerText="Volume: "+Number(btcData.volumeUsd24Hr).toFixed(2);
  ethprice.innerText="Price USD: "+Number(ethData.priceUsd).toFixed(2);
  ethprice.appendChild(ethArrow);
  ethsupply.innerText="Supply: "+Number(ethData.supply).toFixed(2);
  ethvolume.innerText="Volume: "+Number(ethData.volumeUsd24Hr).toFixed(2);
  for(let i = 0; i<dataLength;i++){
    coinSymbols.push(Assetdata[i].symbol);
  }
  coinSymbols.sort();
  for(let i = 0; i<dataLength;i++){
    coinOptions.push(document.createElement("option"));
    coinOptions[i].value=coinSymbols[i];
    coinOptions[i].innerText=coinSymbols[i];
    coinDropdown.appendChild(coinOptions[i]);
  }
  coinDropdown.addEventListener("change", (event)=>{ //eventListener to put coin info on the dom elements
    if(otherUSDIndex>3){
      return;
    }
    dynData[otherUSDIndex]=Assetdata.find((element)=>element.symbol==event.target.value);
    let leftCreatedDiv = document.createElement("div");
    let leftH2 = document.createElement("h2");
    let leftprice=document.createElement("p");
    let leftsupply=document.createElement("p");
    let leftvolume=document.createElement("p");
    let infoButtonDiv=document.createElement("div")
    let infoHead=document.createElement("h3");
    let infoButton=document.createElement("button");
    let leftArrow=Number(dynData[otherUSDIndex].changePercent24Hr)>0?positive.cloneNode(true):negative.cloneNode(true);
    infoButton.innerText="ｘ";
    infoHead.innerText=event.target.value;
    infoButtonDiv.appendChild(infoHead);
    infoButtonDiv.appendChild(infoButton);
    infoHeader.appendChild(infoButtonDiv);
    infoHead.className="xLineup";
    infoButton.className="x";
    infoButtonDiv.className="infoButtonDivplus commonFont";
    leftH2.innerText=dynData[otherUSDIndex].symbol;
    leftprice.innerText="Price USD: "+Number(dynData[otherUSDIndex].priceUsd).toFixed(2);
    leftprice.appendChild(leftArrow);
    leftsupply.innerText="Supply: "+Number(dynData[otherUSDIndex].supply).toFixed(2);
    leftvolume.innerText="Volume: "+Number(dynData[otherUSDIndex].volumeUsd24Hr).toFixed(2);
    leftH2.className="infoHead"
    leftprice.className="infoPrice";
    leftsupply.className="infoSupply";
    leftvolume.className="infoVolume";
    leftCreatedDiv.appendChild(leftH2);
    leftCreatedDiv.appendChild(leftprice);
    leftCreatedDiv.appendChild(leftsupply);
    leftCreatedDiv.appendChild(leftvolume);
    leftCreatedDiv.className="prices commonFont commonColor";
    leftDiv.appendChild(leftCreatedDiv);
    infoButton.addEventListener("click",()=>{
      infoButtonDiv.remove();
      leftCreatedDiv.remove();
      otherUSDIndex--;
    })
    otherUSDIndex++;
  });
  updateScrollPrice();
  setInterval(()=>{updateScrollPrice()},51000);
  setInterval(()=>{updateDropdownPrices()},10000);//update prices every 10 seconds
});
//#endregion

function updateScrollPrice(){
  let limitedEndpoint="https://api.coincap.io/v2/assets?limit=10"
  updateScrollInfo(limitedEndpoint).then((response)=>{
    scrollPrices.innerText="";
    scrollPriceText="";
    let top10=[];
    let top10Data=response.data;
    for(let i = 0; i <top10Data.length; i++){
      top10.push(top10Data[i]);
    }
    console.log(top10);
    top10.forEach((element)=>{
      scrollPriceText+=element.symbol+"=" +Number(element.priceUsd).toFixed(2)+ " 24 Hr Trading Volume: "+Number(element.volumeUsd24Hr).toFixed(2)+" ";
    });
    scrollPrices.innerText="Top ten cryptocurrencies (Update 50s) "+scrollPriceText;
  });
}


//#region function to update prices
function updateDropdownPrices(){
  let heads=document.getElementsByClassName("infoHead");
  let prices=document.getElementsByClassName("infoPrice");
  let supplies=document.getElementsByClassName("infoSupply");
  let volumes=document.getElementsByClassName("infoVolume");
  let originalEndpoint="https://api.coincap.io/v2/assets/";
  let updateEndpoint=[];
  let updateTarget;
  for(let i = 0; i<heads.length;i++){
    updateTarget=Assetdata.find((element)=>element.symbol==heads[i].innerText);
    updateEndpoint[i]=originalEndpoint+updateTarget.id;
  }
  updateEndpoint.forEach((element, index)=>{
    updateAssetInfo(element).then((response)=>{
      let updatedData = response.data;
      let arrow=Number(updatedData.changePercent24Hr)>0?positive.cloneNode(true):negative.cloneNode(true);
      prices[index].innerText="Price USD: "+Number(updatedData.priceUsd).toFixed(2);
      supplies[index].innerText="Supply: "+Number(updatedData.supply).toFixed(2);
      volumes[index].innerText="Volume: "+Number(updatedData.volumeUsd24Hr).toFixed(2);
      prices[index].appendChild(arrow);
    });
  });
}
//#endregion

//#region newsArticles
getArticles().then((response)=>{
  console.log(response)
  for(let i =0; i<5; i++){ //initialize slide related variables 
    slideImages[i].src=response.articles.articles[i].urlToImage;
    slideImages[i].alt="News Article Image";
    tempTitle=trimTitle(response.articles.articles[i].title, 75);
    slideArticleTitles.push(tempTitle);
    slideArticleLinks.push(response.articles.articles[i].url);
    slideArticleAuthors.push(response.articles.articles[i].author);
    slideArticleSources.push(response.articles.articles[i].source.name);
  }
  displayLatest(slideIndex); //display news slideshow
  slideNavigatorDiv.style.display="flex";
  articleTitleDiv.style.display="block";
  pageDisplay.value=1;
  displayOtherArticles(response); //display 95 other articles
  previousArticleButton.addEventListener("click", ()=>{displayOtherArticles(response, -1, lastOtherIndex)});
  nextArticleButton.addEventListener("click", ()=>{displayOtherArticles(response, 1, lastOtherIndex)});
  
});
//#endregion
