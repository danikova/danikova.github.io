
class TRXSetBase{
    constructor(intensity){
        this.time = 0;
        this.exercises = [];
        this.intensity = intensity;
    }
}

class TRXWarmup extends TRXSetBase{
    constructor(warmupTime){
        super(undefined);
        this.time = warmupTime;
        this.exercises.push(null);
    }
}

class TRXSet extends TRXSetBase{
    constructor(intensity){
        super(intensity);
        this.isFull = false;
    }

    addExercise(exer){
        this.exercises.push(exer);
        if(this._isRepeatedExercise(exer))
            this.exercises.push(exer);

        if(this.intensity.repeat <= this.exercises.length)
            this.isFull = true;

        this._calculateSumTime();
    }

    _calculateSumTime(){
        this.time = this.exercises.length * this.intensity.repeat * (this.intensity.workTime+this.intensity.pauseTime);
    }

    _isRepeatedExercise(exer){
        if(TRXApp.exercises != undefined && TRXApp.exercises.repeatedExercises.find(x=>x==exer)){
            return true;
        }
        return false;
    }
}

class SetManager{
    constructor(warmupTime, intensity){
        this.sets = [new TRXWarmup(warmupTime), new TRXSet(intensity)];
        this.intensity = intensity;
        this.isFull = false;
        this.time = 0;
    }

    addExercise(exer){
        var actSet = this.sets[this.sets.length-1];
        if(!actSet.isFull){
            actSet.addExercise(exer);
        }else if(this.intensity.sets+1 > this.sets.length){
            actSet = new TRXSet(this.intensity);
            actSet.addExercise(exer);
            this.sets.push(actSet);
        }

        this.isFull = this.intensity.sets+1 <= this.sets.length && actSet.isFull;
        this.getSumTime();
    }

    getSumTime(){
        this.time = 0;
        for (const set of this.sets) {
            this.time += set.time;
        }
        return this.time;
    }

    getExerciseByNumber(num){
        if(num!=undefined){
            var prevExers = 0;
            for (const set of this.sets.subarray(1)) {
                if(prevExers + set.exercises.length * this.intensity.repeat > num){
                    return set.exercises[num%set.exercises.length];
                }else{
                    prevExers += set.exercises.length * this.intensity.repeat;
                }
            }
        }
        return this.sets[1].exercises[0];
    }
}