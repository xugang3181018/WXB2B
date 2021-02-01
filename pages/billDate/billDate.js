Page({
    data: {
        
    },

    onLoad(options) {
        this.calendar()
    },
    calendar() {
        let weeks = "一二三四五六日".split(''),
            monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            pastMleft = {
                0: 6,
                1: 7,
                2: 1,
                3: 2,
                4: 3,
                5: 4,
                6: 5
            };
        var time = new Date(),
            thisY = time.getFullYear(),
            thisM = time.getMonth(),
            thisD = time.getDate();

        function cal() {
            var realM = thisM + 1,
                firstDW = new Date(thisY, thisM, 1).getDay(),
                thisMD = monthDays[thisM],
                pastMD = pastMleft[firstDW];
            var lists = [];
            monthDays[1] = (thisY % 400 == 0 || (thisY % 4 == 0 && thisY % 100 == 0)) ? 29 : 28

            for (var i = 0, l = weeks.length; i < l; i++)
                lists.push('<span class="week">' + weeks[i] + '</span>')
            for (var i = 0; i < pastMD; i++)
                lists.push('<span class="past"></span>')
            for (var i = 1; i <= thisMD; i++) {
                var str = i == thisD ? 'today' : i < thisD ? 'now' : 'fur'
                lists.push('<span class="' + str + '">' + i + '</span>')
            }
            for (var i = 0; i < 42 - thisMD - pastMD; i++)
                lists.push('<span class="next"></span>')
            $('#cal-wrap').html(lists.join(' '))
        }
    },



})