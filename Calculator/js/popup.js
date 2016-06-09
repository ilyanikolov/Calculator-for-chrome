/***** math.js trigonometric functions configuration *****/

var angles = document.getElementById('angles');


var replacements = {};
var config = {
   angles: 'rad' // 'rad','deg','grad'
};

['sin','cos','tan'].forEach(function(name) {
   var fn = math[name]; // the original function

   var fnNumber = function(x) {
      switch(config.angles) {
         case 'deg': 
            return fn(x / 360 * 2 * Math.PI);
         case 'grad':
            return fn(x / 400 * 2 * Math.PI);
         default: 
            return fn(x);
      }
   };

   // create a typed-function which check the input types

   replacements[name] = math.typed(name, {
      'number': fnNumber,
      'Array | Matrix': function (x) {
         return math.map(x, fnNumber);
      }
   });
});

math.import(replacements, {override: true});

angles.onchange = function() {
   config.angles = this.option.value;
};



/***** Main functionality *****/

// var num = ['1','2','3','4','5','6','7','8','9','0','.'];
var num = '1,2,3,4,5,6,7,8,9,0';
// var opr = ['÷','×','-','+','%']; 
var opr = '÷,×,-,+,%,^,!';
// var trgn = ['sin','cos','tan','ln','log'];
var trgn = 'sin,cos,tan,ln,log,√';
var cnst = 'π,e';
var brts = '(,)';
var decimalAdded = false;
var solved = false;
var lastResult = '0';

var md_time;


// Get all the keys from document
var keys = document.querySelectorAll('#keys span');

// Add onclick event to all the keys and perform operations
for(var i = 0; i < keys.length; i++) {
   var clearBtn = document.getElementById('clear');

   var eq = document.getElementById('eq');
   var br = document.getElementById('br');

   //
   keys[i].onmousedown = function(e){
      var d = new Date();
      md_time = d.getTime();

      e.preventDefault();
   };

   keys[i].onmouseup = function(e){
      var btnVal = this.textContent;
      var d = new Date();
      var long_click = (d.getTime() - md_time)>500;
      
      if(long_click && btnVal === 'CE') {
         eq.textContent = '0';
         br.textContent = '';
         decimalAdded = false;
         solved = false;  
      }

      e.preventDefault();
   };

   keys[i].onclick = function(e) {
      var eqVal = eq.textContent;
      var brVal = br.textContent;

      var inputVal = eqVal + brVal;
      var btnVal = this.textContent;
      
      if(eqVal.length > 0) {
         clearBtn.textContent = 'CE';
      }

      if(btnVal === 'AC') {
         eq.textContent = '0';
         decimalAdded = false;
         solved = false;
      }


      else if(btnVal === 'CE') {
         var regExp;
         var lastSymb = eqVal[eqVal.length-1];
         var last2Symb = eqVal.substr(eqVal.length-2,1);


         if(trgn.indexOf(last2Symb) > -1) {
            regExp = /[a-z√]+\($/;
         } 

         else if(brts.indexOf(lastSymb) > -1) {
            if(lastSymb === ')') {
               eq.textContent = eqVal.substr(0, eqVal.length-1);
               br.textContent += ')';
            } else regExp = /\(/;
         } 

         else {
            eq.textContent = eqVal.substr(0, eqVal.length-1);
         }

         if(regExp) {
            eq.textContent = eqVal.replace(regExp, '');
            br.textContent = brVal.replace(/\)/, '');
         }

         if(eq.textContent === '') eq.textContent = '0';
      }


      else if(btnVal === 'Ans') {
         if(lastResult) eq.textContent += lastResult;
      }


      else if(btnVal === '=') {
         var equation = inputVal;
         var lastChar = equation[equation.length - 1];
         
         equation = equation.replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/π/g, 3.141592653589793)
            .replace(/%/g, '/100')
            .replace(/√/g,'sqrt')
            .replace(/log\(/m, 'log10(')
            .replace(/ln\(/m, 'log(');
         console.log(equation);

         if(opr.indexOf(lastChar) > -1 && lastChar !== ')' && lastChar !== '!' && lastChar !== '%'|| lastChar === '.')
            equation = equation.replace(/.$/, '');
         
         if(equation) {
            console.log(equation);
            eq.textContent = math.eval(equation);
            lastResult = eq.textContent;
         }
         
         solved = true;
         decimalAdded = false;
         br.textContent = '';
         clearBtn.textContent = 'AC';
      }


      else if(num.indexOf(btnVal) > -1) {
         if(solved || eq.textContent === '0') { 
            eq.textContent = ''; 
            solved = false;
         }
         var prevChar = eqVal[eqVal.length-1];

         if(cnst.indexOf(prevChar) > -1 && prevChar !== 'e') {
            eq.textContent += '×' + btnVal;
         } else if(prevChar === '0' && eqVal.length === 1) {
            eq.textContent = '';
            eq.textContent += btnVal;
         } else {
            eq.textContent += btnVal;
         }
         
      } 


      else if(opr.indexOf(btnVal) > -1) {
         var lastChar = eqVal[eqVal.length - 1];
         
         if(eqVal === '0' && btnVal === '-') {
            eq.textContent = '';
            eq.textContent += btnVal;
            console.log('minus')
         } 
         
         else if(eqVal !== '' && opr.indexOf(lastChar)  === -1 || solved) {
            eq.textContent += btnVal;
         }
         
         if(opr.indexOf(lastChar) > -1 && eqVal.length > 1) {

            eq.textContent = eqVal.replace(/.$/, btnVal);
         } 

         solved = false;
         decimalAdded =false;
      }


      else if(trgn.indexOf(btnVal) > -1) {
         if(solved || eq.textContent === '0') { 
            eq.textContent = ''; 
            solved = false;
         }

         eq.textContent += btnVal + '(';
         br.textContent += ')';
      }


      else if(brts.indexOf(btnVal) > -1) {
         if(solved || eq.textContent === '0') { 
            eq.textContent = ''; 
            solved = false;
         }

         if(btnVal === '(') {
            eq.textContent += btnVal;
            br.textContent += ')';
         } else if(btnVal === ')') {
            eq.textContent += ')';
            br.textContent = brVal.replace(/\)/i,'');
         }
      }


      else if(btnVal === '.') {
         if(solved || eq.textContent === '0') { 
            eq.textContent = ''; 
            solved = false;
         }

         if(!decimalAdded) {
            eq.textContent += btnVal;
            decimalAdded = true;
         }
      }


      else if(cnst.indexOf(btnVal) > -1) {
         if(solved || eq.textContent === '0') { 
            eq.textContent = ''; 
            solved = false;
         }

         var prevChar = eqVal[eqVal.length-1];

         if(num.indexOf(prevChar) > -1 && prevChar !== '0' && btnVal !== 'e' || cnst.indexOf(prevChar) > -1) {
            eq.textContent += '×' + btnVal;
         } else {
            eq.textContent += btnVal;
         }
         
         // eq.textContent += btnVal;
      }

      // prevent page jumps
      e.preventDefault();
   }; 
}