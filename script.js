var runner;

function doubleZeros(time) {
    return ('0' + time).slice(-2);
}

function getDate() {
    const currentDate = new Date();
    const day = doubleZeros(currentDate.getDate());
    const month = doubleZeros(currentDate.getMonth() + 1);
    const year = currentDate.getFullYear();
    return `${day}.${month}.${year}`;
}

function get_schedule_time() {
    var now = getDate();
    for (var i = 0; i < schedule.length; i += 1) {
        if (schedule[i].date != now) {
            continue;
        }

        if (i + 1 < schedule.length) {
            return [
                {...schedule[i]},
                {...schedule[i + 1]}
            ];
        }

        return [
            {...schedule[i]},
            {...depault}
        ];
    }

    return [{...depault}, {...depault}];
}

function toDatetime(time) {
    time = time.toString().split(':');
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
}

function rowToTime(row) {
    row.sahur = toDatetime(row.sahur).getTime();
    row.iftar = toDatetime(row.iftar).getTime();
    return row;
}

function separateTime(time) {
    var hours = Math.floor(time / (1000 * 60 * 60));
    var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((time % (1000 * 60)) / 1000);

    return [hours, minutes, seconds]
}

function separateDigits(time) {
    return `<div>${time[0]}</div><div>${time[1]}</div>`
}

function cycle() {
    var rows = get_schedule_time();
    var now = new Date().getTime();

    var today = rowToTime(rows[0]);
    var tomorrow = rowToTime(rows[1]);

    var diff = 0, text = "eternity";
    if (now < today.sahur) {
        diff = today.sahur - now;
        text = "sahur";
    } else if (now > today.sahur && now < today.iftar) {
        diff = today.iftar - now;
        text = "iftar";
    } else if (now > today.iftar && now < tomorrow.sahur) {
        diff = tomorrow.sahur - now;
        text = "sahur";
    }

    var time = separateTime(diff);
    document.getElementById("hours").innerHTML = separateDigits(doubleZeros(time[0]));
    document.getElementById("minutes").innerHTML = separateDigits(doubleZeros(time[1]));
    document.getElementById("seconds").innerHTML = separateDigits(doubleZeros(time[2]));
    document.getElementById("description").innerHTML = "until " + text;

    if (diff <= 0) {
        clearInterval(runner);
    }
}

addEventListener("DOMContentLoaded", (event) => {
    cycle();
    runner = setInterval(cycle, 1000);
});
