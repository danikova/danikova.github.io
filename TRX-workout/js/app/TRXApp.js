
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
        TRXApp.exercises = undefined;
        this._initializeExercises();

        // for random workouts
        this.minWorkoutTime = 30 * 60;
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
            TRXApp.exercises = data;
          });
    }

    generateRandomWorkout(){
        if(TRXApp.exercises == undefined){
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
        var prevExe = undefined;
        while(!this.actWorkout.isDone() && i < 1000){
            var rndCol = cols.random();
            var rndRow = rows.random();
            var rndExe = TRXApp.exercises.exercisesArr[rndRow][rndCol];
            if(rndExe != null && prevExe != rndExe){
                this.actWorkout.addExercise(rndExe);
                prevExe = rndExe;
            }
            i++;
        }

        console.log(this.actWorkout.setManager);

        this.timer.setWorkout(this.actWorkout);
        this.gotoPage(3);
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