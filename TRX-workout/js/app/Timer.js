
class TRXTimer{
    constructor(){
        this._initializeVariables();
        this.backgroundNode = $('#page3');
        this.workoutNameNode = $('#page3 #workout-name');
        this.timerNode = $('#page3 #timer');
        this.statusNode = $('#page3 #act-status-text');
        this.picNode = $('#page3 #act-exercise-pic');
        this.nextNode = $('#page3 #next-text');
        this.elapsedNode = $('#page3 #elapsed-time');
        this.remainingNode = $('#page3 #remaining-time');
        
        this._bindPauseButton();
    }

    setWorkout(workout){
        this._initializeVariables();

        this.workout = workout;
        this.workoutNameNode.text(this.workout.name);

        this.nextNode.show();
        this._setPicture(this.actualExercise);
        this.backgroundNode.css('background','');

        this._resetTimerLoop();
        this._startTimer();
    }

    _initializeVariables(){
        this.time = 0;

        this.set = 0;
        this.repeat = 0;

        this.actualExercise = 0;
        this.exerciseTime = -1;
        this.workout = undefined;
        this.exerciseNumber = -1;
    }

    _resetTimerLoop(){
        this.time = 0;
        this._pauseTimer();
        this._updateCornerTimers();
        this._updateMainTimer(0);
    }

    _pauseTimer(){
        if(this.intervalId != undefined){
            clearInterval(this.intervalId);
            delete this.intervalId;
        }
    }

    _startTimer(){
        this._pauseTimer();
        var lastInterval = (new Date()).getTime();
        this.intervalId = setInterval(()=>{
            this._updateCornerTimers();

            if(this.time < this.workout.warmupTime){
                this._updateMainTimer(60 - this.time);
            }else{
                this._updatingExerciseVariables();
                this._updatingMainTimer();
            }
            this._changeHandler();
            this.time+=1;
        }, 1000);
    }

    _updatingExerciseVariables(){
        this.exerciseTime = parseInt((this.time - this.workout.warmupTime) % (this.workout.intensity.workTime+this.workout.intensity.pauseTime));
        this.exerciseNumber = parseInt((this.time - this.workout.warmupTime) / (this.workout.intensity.workTime+this.workout.intensity.pauseTime));
    }

    _updatingMainTimer(){
        if(this.exerciseTime < this.workout.intensity.workTime)
            this._updateMainTimer(this.workout.intensity.workTime - this.exerciseTime);
        else
            this._updateMainTimer(this.workout.intensity.pauseTime - (this.exerciseTime - this.workout.intensity.workTime));
    }

    _changeHandler(){
        if(0 == this.exerciseTime)
            this._startExerciseHandler();
        else if(this.exerciseTime == this.workout.intensity.workTime)
            this._pauseExerciseHandler();
    }

    _startExerciseHandler(){
        singleDing();
        this.nextNode.hide();
        this.actualExercise = this._getActualExercise(this.exerciseNumber);
        this._setPicture(this.actualExercise);
        this.backgroundNode.css('background','lime');
    }

    _pauseExerciseHandler(){
        doubleDing();
        this.nextNode.show();
        this._setPicture(this._getActualExercise(this.exerciseNumber+1));
        this.backgroundNode.css('background','');
    }

    _getActualExercise(number){
        if(number % this.workout.intensity.repeat == 0)
            this.repeat++;
        if(this.repeat == this.workout.intensity.repeat){
            this.repeat = 0;
            this.set++;
        }
        if(this.set == this.workout.intensity.sets){
            this._resetTimerLoop();
            this._finishHandler();
        }

        return number%this.workout.intensity.repeat + this.set*this.workout.intensity.sets;
    }
    
    _finishHandler(){
        alert('Congrat noob');
    }

    _updateMainTimer(time){
        this.timerNode.text(this._getPPtime(time));
    }

    _updateCornerTimers(){
        this.elapsedNode.text(this._getPPtime(this.time));
        this.remainingNode.text(this._getPPtime(this.workout.getSumExercisesTime() - this.time));
    }

    _setPicture(index){
        this.picNode.attr('src','./js/exercises/pics/' + this.workout.exercises[index]);
    }

    _getPPtime(seconds){
        return ('0'+parseInt(seconds/60)).slice(-2) + ':' + ('0'+parseInt(seconds%60)).slice(-2);
    }

    _bindPauseButton(){
        var clickableTimerNode = this.timerNode.closest('div.timer.circle');
        clickableTimerNode.unbind().click((e)=>{
            if(this.intervalId == undefined){
                this.statusNode.text('Click to pause');
                this._startTimer();
                noSleep.enable();
            }
            else{
                this.statusNode.text('Timer paused');
                this._pauseTimer();
                noSleep.disable();
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }
}