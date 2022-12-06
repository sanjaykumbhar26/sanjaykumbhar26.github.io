var jQueryScript = document.createElement('script');
jQueryScript.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js');
document.head.appendChild(jQueryScript);

var vueScript = document.createElement('script');
vueScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/vue@2.7.13');
document.head.appendChild(vueScript);

var style = document.createElement('link');
style.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.2/css/bootstrap-grid.min.css');
style.setAttribute('rel', 'stylesheet');

document.head.appendChild(style);


var font = document.createElement('link');
font.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
font.setAttribute('rel', 'stylesheet');
document.head.appendChild(font);


var style = document.createElement('link');
style.setAttribute('href', 'https://cdn.mortgagebigger.co/buydowncalc/style.css');
// style.setAttribute('href', 'style.css');

style.setAttribute('rel', 'stylesheet');

document.head.appendChild(style);




function defer(method) {
    if (window.jQuery && window.Vue) {
        method();
    } else {
        setTimeout(function () { defer(method) }, 50);
    }
}
defer(async function () {

    $('head').append('<link rel="shortcut icon" type="image/png" href="https://diamondresidential.com/images/favicon.png"/>');


    let template = await fetch("https://cdn.mortgagebigger.co/buydowncalc/calculator.html")
    // let template = await fetch("calculator.html")

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    const formatter2 = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
    });
    template = await template.text()
    var app = new Vue({
        el: '#calculator',
        template: template,
        data: {
            message: 'DRMC Buydown Calculator',
            loanAmount: 300000,
            interestRateAnnual: 7.00,
            loanPeriodInYears: 30,
            twoOneOfPayment1: 12,
            twoOneOfPayment2: 12,
            zeroOneOfPayment2: 12,
            showModal: false,
            periods: [10, 15, 20, 30],
            activeRate: '2-1',
            rateList: [
                // '3-2-1',
             '2-1', '1-0'],

        },
        computed: {

            tto() {

                let rate = 0;
                let mp = 0;
                let off = 12;

                rate = parseFloat(this.interestRateAnnual - 3);
                mp = -this.PMT((rate / 100) / 12, this.totalPayment, this.loanAmount);
                mpr = (parseFloat(this.monthlyPayment) - parseFloat(mp));
                ampr = mpr * off;
                let three = {
                    rate: rate,
                    mp: mp,
                    mpr: mpr,
                    of: off,
                    ampr: ampr
                };

                rate = parseFloat(this.interestRateAnnual - 2);
                mp = -this.PMT((rate / 100) / 12, this.totalPayment, this.loanAmount);
                mpr = (parseFloat(this.monthlyPayment) - parseFloat(mp));
                ampr = mpr * off;
                let two = {
                    rate: rate,
                    mp: mp,
                    mpr: mpr,
                    of: off,
                    ampr: ampr
                };

                rate = parseFloat(this.interestRateAnnual - 1);
                mp = -this.PMT((rate / 100) / 12, this.totalPayment, this.loanAmount);
                mpr = (parseFloat(this.monthlyPayment) - parseFloat(mp));
                ampr = mpr * off;
                let one = {
                    rate: rate,
                    mp: mp,
                    mpr: mpr,
                    of: off,
                    ampr: ampr
                };



                console.log('321', three)
                return [
                    three,
                    two,
                    one
                ]
            },

            to() {

                let rate = 0;
                let mp = 0;
                let off = 12;

              

                rate = parseFloat(this.interestRateAnnual - 2);
                mp = -this.PMT((rate / 100) / 12, this.totalPayment, this.loanAmount);
                mpr = (parseFloat(this.monthlyPayment) - parseFloat(mp));
                ampr = mpr * off;
                let two = {
                    rate: rate,
                    mp: mp,
                    mpr: mpr,
                    of: off,
                    ampr: ampr
                };

                rate = parseFloat(this.interestRateAnnual - 1);
                mp = -this.PMT((rate / 100) / 12, this.totalPayment, this.loanAmount);
                mpr = (parseFloat(this.monthlyPayment) - parseFloat(mp));
                ampr = mpr * off;
                let one = {
                    rate: rate,
                    mp: mp,
                    mpr: mpr,
                    of: off,
                    ampr: ampr
                };

                return [
                    two,
                    one
                ]
            },

            oz() {

                let rate = 0;
                let mp = 0;
                let off = 12;

            

                rate = parseFloat(this.interestRateAnnual - 1);
                mp = -this.PMT((rate / 100) / 12, this.totalPayment, this.loanAmount);
                mpr = (parseFloat(this.monthlyPayment) - parseFloat(mp));
                ampr = mpr * off;
                let one = {
                    rate: rate,
                    mp: mp,
                    mpr: mpr,
                    of: off,
                    ampr: ampr
                };

                return [
                    one
                ]
            },
            loanAmountFormatted: function () {
                return formatter.format(this.loanAmount);
            },
            interestRateAnnualFormatted: function () {
                return this.interestRateAnnual + '%';
            },

            monthlyPaymentFormatted: function () {
                return formatter.format(this.monthlyPayment);
            },
            totalPaymentFormatted: function () {
                return this.totalPayment;
            },

            monthlyPayment: function () {
                return -this.PMT((parseFloat(this.interestRateAnnual) / 100) / 12, this.totalPayment, this.loanAmount)
            },
            totalPayment: function () {
                return parseFloat(this.loanPeriodInYears) * 12
            },


            ttoTotalPaymentRed: function () {
                let amount = 0;
                console.log(this.tto)
                for (let index = 0; index < this.tto.length; index++) {
                    const item = this.tto[index];
                    amount += parseFloat(item.ampr)
                }
                return amount
            },
            ttoBuyDownPricing: function () {
                return ((parseFloat(this.ttoTotalPaymentRed) / parseFloat(this.loanAmount)) * 100).toFixed(3)
            },

            toTotalPaymentRed: function () {
                let amount = 0;
                for (let index = 0; index < this.to.length; index++) {
                    const item = this.to[index];
                    amount += parseFloat(item.ampr)
                }
                return amount
            },
            toBuyDownPricing: function () {
                return ((parseFloat(this.toTotalPaymentRed) / parseFloat(this.loanAmount)) * 100).toFixed(3)
            },

            ozTotalPaymentRed: function () {
                let amount = 0;
                for (let index = 0; index < this.oz.length; index++) {
                    const item = this.oz[index];
                    amount += parseFloat(item.ampr)
                }
                return amount
            },
            ozBuyDownPricing: function () {
                return ((parseFloat(this.ozTotalPaymentRed) / parseFloat(this.loanAmount)) * 100).toFixed(3)
            },




      


        },
        methods: {
            PMT(ir, np, pv, fv, type) {
                /*
                 * ir   - interest rate per month
                 * np   - number of periods (months)
                 * pv   - present value
                 * fv   - future value
                 * type - when the payments are due:
                 *        0: end of the period, e.g. end of month (default)
                 *        1: beginning of period
                 */
                var pmt, pvif;

                fv || (fv = 0);
                type || (type = 0);

                if (ir === 0)
                    return -(pv + fv) / np;

                pvif = Math.pow(1 + ir, np);
                pmt = - ir * (pv * pvif + fv) / (pvif - 1);

                if (type === 1)
                    pmt /= (1 + ir);

                return pmt.toFixed(2);
            },
            selectPeriod(period) {
                this.loanPeriodInYears = period;
            },
            onRateSelect(rate) {
                this.activeRate = rate;

            },
            format(amount) {
                return formatter2.format(amount);

            },
            formatDecimal(amount) {
                return amount.toFixed(2).replace('.00','')
            },
            onModalOpen() {
                this.showModal = true;
            },
            onModalClose() {
                this.showModal = false;
            },
            test() {
                console.log('test called')
            }
        }
    })

});
