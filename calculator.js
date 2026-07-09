function calculateLoan(){

  let amount=parseFloat(document.getElementById("amount").value);
  let years=parseFloat(document.getElementById("years").value);
  let interest=parseFloat(document.getElementById("interest").value)/100/12;
  let payments=years*12;

  let x=Math.pow(1+interest,payments);
  let monthly=(amount*x*interest)/(x-1);

  if(!isFinite(monthly) || monthly<=0){
    document.getElementById("ledger").classList.remove("is-visible");
    return;
  }

  let totalRepayment=monthly*payments;
  let totalInterest=totalRepayment-amount;

  document.getElementById("payment").innerHTML="$"+monthly.toFixed(2);
  document.getElementById("totalInterest").innerHTML="$"+totalInterest.toFixed(2);
  document.getElementById("totalRepayment").innerHTML="$"+totalRepayment.toFixed(2);

  document.getElementById("ledger").classList.add("is-visible");

}
