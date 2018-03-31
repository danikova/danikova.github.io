
var intensityTimes = Object.freeze({
    "low":{workTime: 45, pauseTime: 25, repeat: 2, sets: 4},
    "high":{workTime: 30, pauseTime: 10, repeat: 3, sets: 3}
});
Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

class TRXWorkout{
    constructor(initialDict){
        this.name = initialDict.name;
        this.intensity = initialDict.intensity;
        this.warmupTime = 60;
        this.exercises = [];
    }

    addExercise(exer){
        this.exercises.push(exer);
        this._splitUnnecessaryExercises();
    }

    getSumExercisesTime(){
        return this.warmupTime + (
            this.exercises.length * (
                this.intensity.workTime
                 + this.intensity.pauseTime
            ) * this.intensity.repeat
        )
    }

    isItLastExercise(exer){
        if(this.exercises.length)
            return this.exercises[this.exercises.length-1] == exer;
        else
            return false;
    }

    _splitUnnecessaryExercises(){
        this.exercises = this.exercises.slice(
            0, 
            this.intensity.repeat*this.intensity.sets
        );
    }
}