const response = await fetch("https://nikitariusov.github.io/3D_print_calculator/settings/settings.json");
const settings = await response.json();

const MATERIALS = settings.materials;
const PRINTERPOWER = 300;
const ELECTRICITYCOST = 4.3;
const PRINTERDEPRECIATION = 10;
const DEFAULTPROFIT = 20;

const materialsName = MATERIALS.map((element) => element.name);
const materialData = {};
MATERIALS.forEach((element) => {
  materialData[element.name] = {
    weight: element.weight,
    cost: element.cost,
  };
});

// Получение ДОМ элементов
const selectMaterials = document.getElementById("materials");
const printCostElem = document.getElementById("printCost");
const userProfitPercentElem = document.getElementById("userProfitPercent");
const userProfitUAHElem = document.getElementById("userProfitUAH");
const withoutProfitElem = document.getElementById("withoutProfit");


// Создание списка материалов на странице
materialsName.forEach((element) => {
  let material = document.createElement("option");
  material.text = element;
  material.className = "materials__item";
  selectMaterials.append(material);
});

// Очистка полей заработка при изменени значений
const clearProfitPercentElem = () => {
  userProfitPercentElem.value = ''
};
const clearProfitUAHElem = () => {
  userProfitUAHElem.value = "";
};
  

// Основная логика расчета
const calculation = () => {
  let userProfitPercent = +userProfitPercentElem.value;
  let userProfitUAH = +userProfitUAHElem.value;
  let printTimeHours = +document.getElementById("printTimeHours").value || 0;
  let printTimeMinutes = +document.getElementById("printTimeMinutes").value || 0;
  let weight = +document.getElementById("weight").value;
  let materialWeight = +materialData[selectMaterials.value].weight;
  let materialCost = +materialData[selectMaterials.value].cost;
  let filamentCost = materialCost / materialWeight;
  let printTime = printTimeHours * 60 + printTimeMinutes;
  

  let energyConsumption = (printTime * PRINTERPOWER) / 60;
  let electricityCost = (energyConsumption / 1000) * ELECTRICITYCOST;
  let costOfFilamentConsumed = (weight / 1000) * filamentCost;
  let printerDepreciationPerPrinting = (printTime / 60) * PRINTERDEPRECIATION;
  let costOfPrintingWithoutProfit = electricityCost + costOfFilamentConsumed + printerDepreciationPerPrinting;
  let profit;
  let totalPrintingCost;

  if (userProfitUAH) {
    profit = userProfitUAH;
  } else if (userProfitPercent) {
    profit = costOfPrintingWithoutProfit * (userProfitPercent / 100);
  } else {
    profit = costOfPrintingWithoutProfit * (DEFAULTPROFIT / 100);
  }
 
  totalPrintingCost = costOfPrintingWithoutProfit + profit;
  // console.log(`Profit: ${totalPrintingCost}`);
  // console.log(printCostElem.data);

  userProfitUAHElem.placeholder = profit.toFixed(0);
  if (userProfitUAH) {
    userProfitPercentElem.placeholder = (profit / totalPrintingCost * 100).toFixed(1)
  }

  withoutProfitElem.textContent = costOfPrintingWithoutProfit.toFixed(0);
  printCostElem.textContent = totalPrintingCost.toFixed(0);
};


// Добавление событий на элементы
userProfitPercentElem.addEventListener('input', clearProfitUAHElem)
userProfitUAHElem.addEventListener('input', clearProfitPercentElem)
const inputElement = document.querySelectorAll("input");
inputElement.forEach((element) => {
  element.addEventListener("input", calculation);
});
selectMaterials.addEventListener("change", calculation);
