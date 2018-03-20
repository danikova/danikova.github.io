
class TRXApp{
    constructor(){
        this.actPage = 0;
        this.pages = [
            $('#page0'),
            $('#page1'),
            $('#page2'),
            $('#page3')
        ];
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
}

var app = new TRXApp();
app.gotoPage(2);