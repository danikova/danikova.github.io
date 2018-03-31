
class TRXApp{
    constructor(){
        this.actPage = 0;
        this.pages = [
            $('#page0'),
            $('#page1'),
            $('#page2'),
            $('#page3')
        ];

        this.timer = new TRXTimer();
        this.exercises = undefined;
        this._initializeExercises();

        // for random workouts
        this.minWorkoutTime = 20 * 60;
        this.actWorkout = undefined;
    }

    gotoPage(pageNumber){
        while(this.actPage != pageNumber){
            if(this.actPage < pageNumber){
                this.pages[this.actPage].addClass('TRX-pager-animation');
                this.actPage++;
            }
            else if(this.actPage > pageNumber){
                this.actPage--;
                this.pages[this.actPage].removeClass('TRX-pager-animation');
            }
        }
    }

    _initializeExercises(){
        $.getJSON( "./js/exercises/exercises.json", data=>{
            this.exercises = data;
          });
    }

    generateRandomWorkout(){
        if(this.exercises == undefined){
            alert('error');
            return;
        }
        
        var cols = this._getArrayOfAttr('#types input[type="checkbox"]', 'tr-col');
        var rows = this._getArrayOfAttr('#levels input[type="checkbox"]', 'tr-row');
        var intensity = (this._getArrayOfAttr('#intensity input[type="checkbox"]', 'tr-int').length)?'high':'low';

        this.actWorkout = new TRXWorkout({
            name: 'Random Workout',
            intensity: intensityTimes[intensity]
        });

        var i = 0;
        while(this.minWorkoutTime > this.actWorkout.getSumExercisesTime() && i < 1000){
            var rndCol = cols.random();
            var rndRow = rows.random();
            var rndExe = this.exercises.exercisesArr[rndRow][rndCol];
            if(this._expressions(rndExe)){
                this.actWorkout.addExercise(rndExe);
                // if(this.exercises.repeatedExercises.find(x=>x==rndExe))
                //     this.actWorkout.addExercise(rndExe);
            }
            i++;
        }

        this.timer.setWorkout(this.actWorkout);
        this.gotoPage(3);
    }

    _expressions(rndExe){
        var result = true;
        result &= rndExe != null;
        result &= !this.actWorkout.isItLastExercise(rndExe);
        return result;
    }

    _getArrayOfAttr(cssSelector, attr){
        var cols = [];
        $(cssSelector).toArray().forEach(element => {
            element = $(element);
            if(element.prop('checked')){
                cols = cols.concat(
                    element.attr(attr).split(',').map(x=>parseInt(x))
                );
            }
        });
        return cols;
    }
}

var app = new TRXApp();

// var noSleep = new NoSleep();
// noSleep.enable();
// noSleep.disable();
