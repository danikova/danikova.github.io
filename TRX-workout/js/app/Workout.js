
var intensityTimes = Object.freeze({
    "low":{workTime: 45, pauseTime: 25, repeat: 2, sets: 4},
    "high":{workTime: 30, pauseTime: 10, repeat: 3, sets: 3}
});

class TRXWorkout{
    constructor(initialDict){
        this.warmupTime = 60;
        this.name = initialDict.name;
        this.intensity = initialDict.intensity;
        this.setManager = new SetManager(this.warmupTime, this.intensity);
    }

    addExercise(exer){
        this.setManager.addExercise(exer);
    }

    getSumExercisesTime(){
        return this.setManager.getSumTime();
    }

    isDone(){
        return this.setManager.isFull;
    }

    
}
