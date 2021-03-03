const schtest = new RegExp(/\(((\*|\?|\d+((\/|\-|\.|\,){0,1}(\d+))*)\s*){4}\)/);
const testDate = (expression, date = new Date()) => {
    // ( hours monthday month weekday)
    if (!schtest.test(expression)) throw new Error('Invalid schedule expression')
    const schedule = expression.replace(/(\(|\))/g, '').trim().split(' ').map(exp => exp.split(',').map(t => t.split('-')))
        .reduce((finalSch, exp, i) => {
            if (i == 0) {
                finalSch.hours = (exp.length == 1 && exp[0] == '*') ? '*' : exp.map(hs => {

                    if (hs.length < 2) {
                        finalSch.error = finalSch.error ? finalSch.error + '|' + 'hours must have init and end' : 'hours must have init and end';

                        return null
                    }
                    let hasMin = false
                    return hs.map(h => {
                        let newh = h.split('.');
                        let obj = {
                            h: Number(newh[0])
                        }
                        if (newh[1] != undefined) {
                            obj.m = `0.${newh[1]}` * 60
                        } else if (hasMin) {
                            obj.m = 0
                        }
                        return obj
                    })
                })
                return finalSch;
            } else if (i == 1) {
                finalSch.monthdays = (exp.length == 1 && exp[0] == '*') ? '*' : exp.reduce((mds, md, j) => {
                    if (Array.isArray(md)) {
                        if (md.length > 2 || md.length < 1) {
                            finalSch.error = finalSch.error ? finalSch.error + '|' + 'month day must be length 1 or 2' : 'month day must be length 1 or 2';

                            return [...mds, null];
                        }
                        if (md.length == 1) {
                            if (md[0].indexOf('.') >= 0) {
                                finalSch.error = finalSch.error ? finalSch.error + '|' + 'month day cant be float' : 'month day cant be float';

                                return [...mds, Number(md[0].split('.')[0])];
                            }
                            return [...mds, Number(md[0])];
                        }
                        const [min, max] = md.map(d => {
                            if (d.indexOf('.') >= 0) {
                                finalSch.error = finalSch.error ? finalSch.error + '|' + 'range month day cant be float' : 'range month day cant be float';

                                return Number(d.split('.')[0]);
                            }
                            return Number(d)
                        });
                        if (min >= max) {
                            finalSch.error = finalSch.error ? finalSch.error + '|' + 'inverted month range' : 'inverted month range';

                            return [...mds, null];
                        }
                        const ds = [min];
                        for (let k = min + 1; k <= max; k++) {
                            ds.push(k);
                        }

                        return [...mds, ...ds];
                    }
                    if (md.indexOf('.') >= 0) {
                        finalSch.error = finalSch.error ? finalSch.error + '|' + 'month day cant be float' : 'month day cant be float';

                        return [...mds, md.split('.')[0]];
                    }
                    return [...mds, md];
                }, [])
                return finalSch;
            } else if (i == 2) {
                finalSch.months = (exp.length == 1 && exp[0] == '*') ? '*' : exp.reduce((mds, md, j) => {
                    if (Array.isArray(md)) {
                        if (md.length > 2 || md.length < 1) {
                            finalSch.error = finalSch.error ? finalSch.error + '|' + 'month must have length 1 or 2' : 'month must have length 1 or 2';

                            return [...mds, null];
                        }
                        if (md.length == 1) {
                            if (md[0].indexOf('.') >= 0) {
                                finalSch.error = finalSch.error ? finalSch.error + '|' + 'month cant be float ' : 'month cant be float ';

                                return [...mds, Number(md[0].split('.')[0])];
                            }
                            return [...mds, Number(md[0])];
                        }
                        const [min, max] = md.map(d => {
                            if (d.indexOf('.') >= 0) {
                                finalSch.error = finalSch.error ? finalSch.error + '|' + 'month extremes cant be float' : 'month extremes cant be float';

                                return Number(d.split('.')[0]);
                            }
                            return Number(d)
                        });
                        if (min >= max) {
                            finalSch.error = finalSch.error ? finalSch.error + '|' + 'month range inverted' : 'month range inverted';

                            return [...mds, null];
                        }
                        const ds = [min];
                        for (let k = min + 1; k <= max; k++) {
                            ds.push(k);
                        }

                        return [...mds, ...ds];
                    }
                    if (md.indexOf('.') >= 0) {
                        finalSch.error = finalSch.error ? finalSch.error + '|' + 'month cant be float' : 'month cant be float';

                        return [...mds, md.split('.')[0]];
                    }
                    return [...mds, md];
                }, [])
                return finalSch;
            } else if (i == 3) {
                finalSch.weekdays = (exp.length == 1 && exp[0] == '*') ? '*' : exp.reduce((mds, md, j) => {
                    if (Array.isArray(md)) {
                        if (md.length > 2 || md.length < 1) {
                            finalSch.error = finalSch.error ? finalSch.error + '|' + 'weekday length must be 1 or 2' : 'weekday length must be 1 or 2';

                            return [...mds, null];
                        }
                        if (md.length == 1) {
                            if (md[0].indexOf('.') >= 0) {
                                finalSch.error = finalSch.error ? finalSch.error + '|' + 'weekday cant be float' : 'weekday cant be float';

                                return [...mds, Number(md[0].split('.')[0])];
                            }
                            return [...mds, Number(md[0])];
                        }
                        const [min, max] = md.map(d => {
                            if (d.indexOf('.') >= 0) {
                                finalSch.error = finalSch.error ? finalSch.error + '|' + 'weekday extremes cant be float' : 'weekday extremes cant be float';

                                return Number(d.split('.')[0]);
                            }
                            return Number(d)
                        });
                        if (min >= max) {
                            finalSch.error = finalSch.error ? finalSch.error + '|' + 'weekday range inverted' : 'weekday range inverted';

                            return [...mds, null];
                        }
                        const ds = [min];
                        for (let k = min + 1; k <= max; k++) {
                            ds.push(k);
                        }

                        return [...mds, ...ds];
                    }
                    if (md.indexOf('.') >= 0) {
                        finalSch.error = finalSch.error ? finalSch.error + '|' + 'weekday cant be float' : 'weekday cant be float';

                        return [...mds, md.split('.')[0]];
                    }
                    return [...mds, md];
                }, [])
                return finalSch;
            }
            finalSch.error = finalSch.error ? finalSch.error + '|' + 'cron expresion arguments overloaded' : 'cron expresion arguments overloaded';

            return finalSch;
        }, {
            error: null
        })
    console.log('====================================');
    console.log(JSON.stringify(schedule));
    console.log('====================================');
    if (schedule.error != null) throw new Error(schedule.error);
    if (schedule.months != '*') {
        const m = date.getMonth()
        if (!(schedule.months.includes(m))) return false
    }
    if (schedule.monthdays != '*') {
        const d = date.getDate()
        if (!(schedule.monthdays.includes(d))) return false
    }
    if (schedule.weekdays != '*') {
        const w = date.getDay()
        if (!(schedule.weekdays.includes(w))) return false
    }
    if (schedule.hours != '*') {
        const h = date.getHours()
        const m = date.getMinutes()
        return schedule.hours.map(t => {
            const [{ h: hi, m: mi }, { h: hf, m: mf }] = t;
            console.log(t, hi, mi, hf, mf);
            console.log(h, m);
            if (hi > hf) throw new Error('Minutes range inverted')
            const valid = h >= hi && h <= hf;
            if (!valid) return false;
            if (h == hi) {
                return m >= (mi || 0);
            }
            if (h == hf) {
                return m <= (mf || 0);
            }
            return true
        }).reduce((prev, actual) => prev || actual, false)
    }
    return true

}