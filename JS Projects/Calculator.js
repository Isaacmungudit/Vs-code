//Creating variables to store the current value, first value, and second value
let display = document.getElementById('display');
let buttons = document.getElementsByClassName('num-button');
let opButtons = document.getElementsByClassName('op-button');
let equalsButton = document.querySelector('#equals');

let percent = document.getElementById('percentButton');
let historyList = document.getElementById('history-list');
let clearButton = document.getElementById('clear');
let deleteButton = document.getElementById('delete');
let decimalButton = document.getElementById('decimal');
let value1 = '';
let value2 = '';
let operator = '';
let isReadyForSecondValue = false;

//Looping through the buttons to add eventlisteners
Array.from(buttons).forEach(button => {
    button.addEventListener('click', (event) => {
        let clickedNumber = event.target.innerText;

        if(isReadyForSecondValue){
            //Build the second number
            value2 += clickedNumber;
            display.innerHTML = value2;
        } else {
            //Build the first number
            value1 += clickedNumber;
            display.innerHTML = value1;
        }
    });
});

//Adding decimal functionality
decimalButton?.addEventListener('click', () => {
    const activeValue = isReadyForSecondValue ? value2 : value1;

    if(!activeValue.includes('.')){
        const newValue = (activeValue === '') ? '0.' : activeValue + '.';

        if(isReadyForSecondValue){
            value2 = newValue;
        } else {
            value1 = newValue;
        }

        display.innerHTML = newValue;
    }
});

//Adding functionality to the operator buttons
Array.from(opButtons).forEach(button => {
    button.addEventListener('click', (event) => {
        const newOperator = event.target.innerText;

        if(value1 !== ''){
            if(operator !== '' && value2 !== ''){
                let num1 = parseFloat(value1);
                let num2 = parseFloat(value2);
                let result = 0;

                switch(operator){
                    case '+': result = num1 + num2; break;
                    case '*': result = num1 * num2; break;
                    case '/': result = num1 / num2; break;
                    case '-': result = num1 - num2; break;
                }

                value1 = result.toString();
                value2 = '';
                display.innerHTML = value1;
            }

            operator = newOperator;
            isReadyForSecondValue = true;
        }
    })
})

//Handling the equals sign
equalsButton?.addEventListener('click', () => {
    if(value1 !== '' && value2 !== '' && operator !== ''){
        let num1 = parseFloat(value1);
        let num2 = parseFloat(value2);
        let result = 0;

        switch(operator){
            case '+': result = num1 + num2; break;
            case '*': result = num1 * num2; break;
            case '/': result = num2 !== 0 ? num1 / num2 : 'Error'; break;
            case '-': result = num1 - num2; break;
        }
        //Creating History functionality
        if(result !== 'Error'){
            // Add result to history
            let historyItem =document.createElement('li');
            // Removing bullet points from the history list
            historyItem.className = 'list-unstyled';
            historyItem.innerText = `${value1} ${operator} ${value2} = ${result}`;
            historyList?.insertBefore(historyItem, historyList.firstChild);
        }

        display.innerHTML = result;
        //Reset the state so the user can start a new calculation
        value1 = result.toString();
        value2 = '';
        operator = '';
        isReadyForSecondValue = false;
    }
});

//Adding the clear function
clearButton?.addEventListener('click', () => {
    value1 = '';
    value2 = '';
    operator = '';
    isReadyForSecondValue = false;
    display.innerHTML = '0';
})

//Adding the baskspace function
deleteButton?.addEventListener('click', () => {
    if(isReadyForSecondValue){
        value2 = value2.slice(0, -1);
        display.innerHTML = value2 === '' ? '0' : value2;
    } else{
        value1 = value1.slice(0, -1);
        display.innerHTML = value1 === '' ? '0' : value1;
    }
});

//Adding percentage functionality
percentButton?.addEventListener('click', () => {
    if(isReadyForSecondValue && value2 !== ''){
        let num1 = parseFloat(value1);
        let num2 = parseFloat(value2);
        value2 =((num1*num2)/100).toString();
        display.innerHTML = value2;
    } else if(value1 !== ''){
        let num1 = parseFloat(value1);
        value1 = (num1/100).toString();
        display.innerHTML = value1;
    }
});

//Adding keyboard support
window.addEventListener('keydown', (event) => {
    let key =event.key;

    if(key >= '0' && key <= '9'){
        animateButton(key, 'class-text');
        if(isReadyForSecondValue){
            value2 += key;
            display.innerHTML = value2;
        } else {
            value1 += key;
            display.innerHTML = value1;
        }
    }
    //Handle operator keys
    if(key === '+' || key === '-' || key === '*' || key === '/'){
        if(value1 !== ''){
            animateButton(key, 'class-text');
            //Trigger operator chaining if user types a second operator without pressing equals
            if(operator !== '' && value2 !== ''){
                let num1 = parseFloat(value1);
                let num2 = parseFloat(value2);
                let result = 0;

                switch(operator){
                    case '+': result = num1 + num2; break;
                    case '*': result = num1 * num2; break;
                    case '/': result = num1 / num2; break;
                    case '-': result = num1 - num2; break;
                }
                value1 = result.toString();
                value2 = '';
                display.innerHTML = value1;
            }
            operator = key;
            isReadyForSecondValue = true;
        }
    }
    //Handle the equals key
    if(key === '=' || key === 'Enter'){
        event.preventDefault();
        animateButton('=', 'class-text');
        equalsButton?.click();
    }
    //Handle the backspace key
    if(key === 'Backspace'){
        animateButton('Backspace', 'id');
        if(isReadyForSecondValue){
            value2 = value2.slice(0, -1);
            display.innerHTML = value2 === '' ? '0' : value2;
        } else{
            value1 = value1.slice(0, -1);
            display.innerHTML = value1 === '' ? '0' : value1;
        }
    }
    //Handle the clear key
    if(key === 'Escape'){
        animateButton('Clear', 'id');
        clearButton?.click();
    }
    //Handle the decimal key
    if(key === '.'){
        animateButton('decimal', 'id');
        decimalButton?.click();
    }
    // Handle the percentage key
    if(key === '%'){
        animateButton('percentButton', 'id');
        percentButton?.click();
    }
})
//Helper function to apply visual highlight animation
function animateButton(selector, type='id'){
    let button;
    if(type === 'id'){
        button = document.getElementById(selector);
    } else if (type === 'class-text'){
        button = Array.from(document.getElementsByClassName('num-button'))
        .concat(Array.from(document.getElementsByClassName('op-button')))
        .find(btn => btn.innerText === selector);
    }
    if(button){
        button.classList.add('active-press');
        setTimeout(() => {
            button.classList.remove('active-press');
        }, 150);
    }
}