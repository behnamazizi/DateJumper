document.addEventListener("DOMContentLoaded", () => init());
let st_en, st_fa, jump, backward, forward, sy, sm, sd, st_date, cal, t_en = ['Start at', 'and jump every', 'days.','DAYS'],
    t_fa = ['از', 'شروع کن و هر', 'روز بپر.','روز'];

function init() {
    sy = document.querySelector(`[name='start-date-Y']`);
    sm = document.querySelector(`[name='start-date-M']`);
    sd = document.querySelector(`[name='start-date-D']`);

    backward = document.querySelector(`#backward`);
    forward = document.querySelector(`#forward`);

    calendar()

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js", {
            scope: "/"
        }).then(function (reg) {
            if (reg.installing) {
                console.log("Service worker installing");
            } else if (reg.waiting) {
                console.log("Service worker installed");
            } else if (reg.active) {
                console.log("Service worker active");
            }
        }).catch(error => {
            console.log("Registration failed with" + error);
        });
    }
}

function render() {
    document.querySelectorAll('input').forEach(e => {
        let min = parseInt(e.getAttribute('min')),
            max = parseInt(e.getAttribute('max')),
            value = parseInt(e.value)
        value < min || isNaN(value) ? e.value = min : value > max ? e.value = max : ''
    })

    if (cal == "en") {
        st_en = [sy.value, sm.value, sd.value]
        st_fa = moment.from(st_en.join('/'), 'en', 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD').split('/')
    } else {
        st_en = moment.from([sy.value, sm.value, sd.value].join('/'), 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD').split('/')
        st_fa = [sy.value, sm.value, sd.value]
    }

    st_date.setFullYear(st_en[0]), st_date.setMonth(st_en[1] - 1), st_date.setDate(st_en[2]);

    

    jump = parseInt(document.querySelector(`[name='jumps']`).value);

    options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    forward.innerHTML = "";
    backward.innerHTML = "";
    setTimeout(() => {
        for (let i = 1; i < 11; i++) {
            setTimeout(() => {
                let d = new Date(st_date);
                d.setDate(st_date.getDate() + (i * jump));
                l = d.toLocaleString(cal == 'en' ? 'en-US' : 'fa-Fa', options).replaceAll(',', '').split(' ');
                r = cal == 'en' ? `${l[0]} - ${l[1]} ${l[2]} ${l[3]}` : `${l[3]} - ${l[2]} ${l[1]} ${l[0]}`;
                forward.insertAdjacentHTML('beforeend', `
            <li><span class="days">+${i * jump}<br>${cal == 'en' ? t_en[3] : t_fa[3]}</span><span style="direction: ${cal == 'en' ? 'ltr' : 'rtl'}">${r}</span></li>
            `)
            }, i * 50);
            setTimeout(() => {
                let d = new Date(st_date);
                d.setDate(st_date.getDate() - (i * jump));
                l = d.toLocaleString(cal == 'en' ? 'en-US' : 'fa-Fa', options).replaceAll(',', '').split(' ');
                r = cal == 'en' ? `${l[0]} - ${l[1]} ${l[2]} ${l[3]}` : `${l[3]} - ${l[2]} ${l[1]} ${l[0]}`;
                backward.insertAdjacentHTML('beforeend', `
            <li><span class="days">-${i * jump}<br>${cal == 'en' ? t_en[3] : t_fa[3]}</span><span style="direction: ${cal == 'en' ? 'ltr' : 'rtl'}">${r}</span></li>
            `)
            }, i * 50);
        }
    }, 600);


}

function calendar() {
    cal = document.querySelector(`[name='calendar']`).value
    st_date = new Date();
    st_fa = moment.from(st_date, 'en', 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD').split('/')
    st_en = moment.from(st_date, 'en', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD').split('/')

    if (cal == "en") {
        sy.value = st_en[0];
        sm.value = st_en[1];
        sd.value = st_en[2];
        document.querySelectorAll('.text').forEach((e, i) => {
            e.innerHTML = t_en[i]
        })
        document.querySelector('#start > span').classList.remove('fa');

    } else {
        sy.value = st_fa[0];
        sm.value = st_fa[1];
        sd.value = st_fa[2];
        document.querySelectorAll('.text').forEach((e, i) => {
            e.innerHTML = t_fa[i]
        })
        document.querySelector('#start > span').classList.add('fa');
    }
    render();
}