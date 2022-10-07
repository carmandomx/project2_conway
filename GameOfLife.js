class gameConway {


    constructor() {

        //*******These are the attributes of the class**********

        //Setting the representative color of each cell state
        this.dead = '#000000'; //
        this.alive = '#FFFFFF';
        //parts that are not working properly and need to be blocked are left out of the user's view with transparency
        this.blocked = 'transparent';

        //We set the size of every single cell (relative to the canvas)
        this.cell_size = 10; 

        //Calculating the totals of cells that will be in columns and rows according to the cell size variable
        //This technique allows to change the dimensions of the canvas later without problems.
        this.columnsNumber = Math.floor(canvas.width / this.cell_size); 
        this.rowsNumber = Math.floor(canvas.height / this.cell_size); 
        this.currentGeneration = []; //Use to storage the current generation
        this.nextGeneration = []; //Use to storage the next generation


        //*******These are the methods of the class**********


        //This function create each cells into an array, in every single column and row
        this.gameInitialization = () => { 
            for (let i = 0; i < this.rowsNumber; i++) {
                this.currentGeneration[i] = []; //Create the row
                for (let j = 0; j < this.columnsNumber; j++) {
                    this.currentGeneration[i][j] = 0; // cretate each column of this row
                }
            }
            this.nextGeneration = this.currentGeneration; //initializing the nextGeneration too
        };

        //function to fill with the representative colors of each state of the cells
        this.fillCanvas = () => {
            //The next 3 double "for" are to block sections of the canvas that don't work well
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < this.columnsNumber; j++) {
                    context.fillStyle = this.blocked;
                    context.fillRect(j * this.cell_size, i * this.cell_size, this.cell_size, this.cell_size);
                }
            }
            for (let i = 2; i < this.rowsNumber; i++) {
                for (let j = 0; j < 2; j++) {
                    context.fillStyle = this.blocked;
                    context.fillRect(j * this.cell_size, i * this.cell_size, this.cell_size, this.cell_size);
                }
            }
            for (let i = 2; i < this.rowsNumber; i++) {
                for (let j = this.columnsNumber-1; j < this.columnsNumber; j++) {
                    context.fillStyle = this.blocked;
                    context.fillRect(j * this.cell_size, i * this.cell_size, this.cell_size, this.cell_size);
                }
            }


            //In this double "for" live and dead cells are colored
            for (let i = 2; i < this.rowsNumber; i++) {
                for (let j = 2; j < this.columnsNumber-1; j++) {
                    let color;
                    if (this.currentGeneration[i][j] == 1)
                        color = this.alive;
                    else
                        color = this.dead;
                    context.fillStyle = color;
                    context.fillRect(j * this.cell_size, i * this.cell_size, this.cell_size, this.cell_size);
                }
            }

        };

        //function to change the cell that was clicked
        this.clickCell = (x,y) => {

            for (let i = 0; i < this.rowsNumber; i++) {
                for (let j = 0; j < this.columnsNumber; j++) {
                    
                    //With the coordinates (x,y) of the click, the horizontal and vertical ranges of each cell 
                    //are checked with respect to (x,y), to know which one was clicked.
                    if (x > j*this.cell_size && x <j * this.cell_size + this.cell_size 
                     && y > i*this.cell_size && y < i * this.cell_size + this.cell_size){
                        //If the cell is dead, then it is resurrected.
                       if(this.currentGeneration[i][j] == 0)this.currentGeneration[i][j] = 1;
                       //If the cell is alive, then it is killed.
                       else this.currentGeneration[i][j] = 0;
                     }

                }
            }

        };




        //This function was needed because the error "Cannot read properties of undefined" was being received.
        this.cellStatus = (row, col) => {
            
            //A "try catch" is used to catch the error
            try{

                 return this.currentGeneration[row][col];
            }
            //If the error occurs, it means that it is a hypothetical cell outside the canvas, so it should return "0"
            catch{
                return 0;
            }
            };

        //Function to count the number of living neighbors of each cell
        this.neighboursNumber = (row, col) => {
            let totalNeighbours = 0;
            //each cell has 8 neighbors
            totalNeighbours += this.cellStatus(row - 1, col - 1);
            totalNeighbours += this.cellStatus(row - 1, col);
            totalNeighbours += this.cellStatus(row - 1, col + 1);
            totalNeighbours += this.cellStatus(row, col - 1);
            totalNeighbours += this.cellStatus(row, col + 1);
            totalNeighbours += this.cellStatus(row + 1, col - 1);
            totalNeighbours += this.cellStatus(row + 1, col);
            totalNeighbours += this.cellStatus(row + 1, col + 1);
            
            return totalNeighbours;
        };

        //Function to apply the rules of the game regarding the number of living neighbors
        this.appliedRules = (row, col) => {

            //variable of total living neighbors
            const total = this.neighboursNumber(row, col);

            //variable with the state of the currently analyzed cell
            const stateCell = this.currentGeneration[row][col];


            
            //Cells with more than 3 or less than 2 neighbours dies.
            if (total > 3 || total < 2) {
                return 0;//killing the cell
            }
            //Dead cells with exactly 3 neighbors come to life
            else if (stateCell === 0 && total === 3) {
                return 1; //reviving the cell
            }
            //With 2 or 3 neighbors the cell lives for the next generation
            else {
                return stateCell; //In this case the cll only have to return its own state
            }

        };


        //This function uses previous functions to update the cell generation.
        this.updateGeneration = () => {

            //The next 3 double "for" are to kill the cells of sections of the canvas that don't work well
             for (let i = 0; i < 2; i++) {
                for (let j = 0; j < this.columnsNumber; j++) {
                    this.currentGeneration[i][j] = 0;
                }
            }

            for (let i = 2; i < this.rowsNumber; i++) {
                for (let j = 0; j < 2; j++) {
                    this.currentGeneration[i][j] = 0;
                }
            }

            for (let i = 2; i < this.rowsNumber; i++) {
                for (let j = this.columnsNumber-1; j < this.columnsNumber; j++) {
                    this.currentGeneration[i][j] = 0;
                }
            }

            //After several days of testing, we concluded that there is a detail in the construction of the canvas 
            //that causes a discrepancy between the position of each cell and its reference.
            //For example, if you calculated cell (1,1), the functions returned the results of cell(0,0)
            //Resolving this could take days as it is not visible at what point the problem implicitly starts

            //then it is easier to patch this problem with solutions on top

            for (let i = 0; i < this.rowsNumber-1; i++) {
                for (let j = 0; j < this.columnsNumber-1; j++) {
                    //In this line the cell to be analyzed is corrected
                    let new_state = this.appliedRules(i+1,j+1);
                    this.nextGeneration[i][j] = new_state;
                }
            }

            //However, the above solution creates an offset in the cell positions, i.e. Conway's rules work fine, 
            //but the figures move one position to the left and up for each passing generation


            //so the next double "for" is to pull everything to the opposite side.
            for (let i = this.rowsNumber-1; i > 0; i--) {
                for (let j = this.columnsNumber-1; j > 0; j--) {
                    this.nextGeneration[i][j] = this.nextGeneration[i-1][j-1];
                }
            }
            this.currentGeneration = this.nextGeneration;
            //the above solution leaves everything still, although some canvas areas in borders don't work properly

            //but that is a problem that can be easily solved by visually blocking those areas and killing their cells 
            //(they are the blocked areas that were commented on in the previous code)
        };

    }
}


