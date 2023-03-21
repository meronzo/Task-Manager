
/*  Task Details Animationi */
function ToggleTriangle(Target) {
    Target.classList.toggle("RotateTriangle");
}
function ToggleParent(Target) {
    Target.classList.toggle("LengthenHeight");
}
function AddHeaderEvent() {
    const TaskHeaders = document.getElementsByClassName("TaskHeader");
    for (let TaskHeader of TaskHeaders) {
        TaskHeader.addEventListener("click", () => {
            const ChildTriangle = TaskHeader.getElementsByClassName("Triangle")[0];
            const Parent = TaskHeader.parentElement;
            ToggleTriangle(ChildTriangle);
            ToggleParent(Parent);
        })
    }
}

/*  InputInterface Animation    */
const InputInterface = document.querySelector(".InputInterface");
function ToggleInputInterface() {
    InputInterface.classList.toggle("InputInterfaceActive");
}


const TasksContainer = document.querySelector(".TasksContainer");
const FormDOM = document.querySelector("#Form");
const InputTitle = document.querySelector("#Title");
const InputYear = document.querySelector("#Year");
const InputMonth = document.querySelector("#Month");
const InputDay = document.querySelector("#Day");
const InputContent = document.querySelector("#Content");

let DateStorage = new Map();

let TitleValue = "";
let YearValue = "";
let MonthValue = "";
let DayValue = "";
let ContentValue = "";

const YearChecker = /^0$|^[1-9]\d*$/;
const MonthChecker = /^[1-9]$|^1[0-2]$/;


let ShowDelay;


/*  Output all data from database  */
const getAllTasks = async () => {
    try {
        /*  Fetch data  */
        let allTasks = await axios.get("/api/get");
        let { data } = allTasks;
        data.sort((a, b) => {
            let yearA = a.year, monthA = a.month, dayA = a.day,
                yearB = b.year, monthB = b.month, dayB = b.day;

            switch (true) {
                case yearA != yearB:
                    return -1 * (yearA - yearB);
                case monthA != monthB:
                    return -1 * (monthA - monthB);
                case dayA != dayB:
                    return -1 * (dayA - dayB);
                default:
                    return dayA > dayB;
            }
        })

        /*  Write on DOM    */


        function AddDateHeader(year, month) {
            return `
            <div class="DateHeader">${year}/${month}</div>
            `
        }
        allTasks = data.map((task) => {
            let { title, year, month, day, content, id} = task;
            let AdditionalElement = "";
            if (!DateStorage.has(year)) {
                DateStorage.set(year, new Set());
                // add year header
                // AdditionalElement += AddDateHeader(year, "Year");
            }
            if (!DateStorage.get(year).has(month)) {
                DateStorage.set(year, DateStorage.get(year).add(month));
                AdditionalElement += AddDateHeader(year, month);
            }
            // have to call func to show month or year before returning task
            return `${AdditionalElement}
            <section class="Task" id="${id}">
                <article class="TaskHeader TaskChild">
                    <div class="TaskIcon">
                        <span class="Triangle">▶</span>
                    </div>
                    <h3 class="TaskTitle">${title}</h3>
                    <h4 class="TaskDate">${month}/${day}</h4>
                </article>
                <article class="TaskContent">
                    <article class="TaskExplanation TaskChild">
                        ${content}
                    </article>
                    <div class="TaskCommands TaskChild">
                        <button onClick=TaskEdit(this)><i class="fa-regular fa-pen-to-square"></i></button>
                        <button><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </article>
            </section>
            `
        }).join("");
        TasksContainer.innerHTML = allTasks;
        AddHeaderEvent();
    } catch (err) {
        console.log(err);
    }
}
getAllTasks();

/*  Set values in input */
function SetInputWith(title, year, month, day, content){
    InputTitle.value = title;
    InputYear.value = year;
    InputMonth.value = month;
    InputDay.value = day;
    InputContent.value = content;
}


/*  Show Errors to notify users  */
const ErrorContainer = document.querySelector(".ErrorContainer");
function ShowDateError(unit, messageType) {
    /* ErrorMessage Setting */
    let ErrorTarget = `${unit}Error`;
    let DOM = document.createElement("div");
    switch (messageType) {
        case "Empty":
            DOM.textContent = `${unit} is remained empty!`;
            break;
        case "Format":
            DOM.textContent = `Format of ${unit} is wrong!`;
            break;
    }
    DOM.className = `ErrorMessage ${ErrorTarget}`;

    /*  Append DOM   */
    setTimeout(() => {
        ErrorContainer.insertBefore(DOM, ErrorContainer.firstChild);
        document.getElementsByClassName(ErrorTarget)[0].classList.remove("ErrorFadeIn");
        document.getElementsByClassName(ErrorTarget)[0];
        document.getElementsByClassName(ErrorTarget)[0].classList.add("ErrorFadeIn");
    }, 30 * ShowDelay);
    /*  Delete DOM  */
    setTimeout(() => {
        document.getElementsByClassName(ErrorTarget)[0].classList.remove("ErrorFadeIn");
        document.getElementsByClassName(ErrorTarget)[0];
        document.getElementsByClassName(ErrorTarget)[0].classList.add("ErrorFadeOut");
    }, 2200 + 110 * ShowDelay);
    ShowDelay++;
}

function ifDateValid(Content, unit) {
    switch (unit) {
        case "Day":
            let MaxDay = new Date(YearValue, MonthValue, 0).getDate();
            let LimitMonth = Math.floor(MaxDay / 10), LimitDay = MaxDay % 10;
            Checker = new RegExp(`^([1-${LimitMonth}][0-${LimitDay}])|([1-9])$`);
            console.log(String(Checker));
            break;
        case "Month":
            Checker = MonthChecker;
            break;
        case "Year":
            Checker = YearChecker;
            break;
    }

    switch (true) {
        case Content == "":
            ShowDateError(unit, "Empty");
            return false;
        case Checker.test(Content) == false:
            ShowDateError(unit, "Format");
            return false;
        default:
            return true;
    }
}
function ifInputEmpty() {
    ShowDelay = 0;
    ifDateValid(YearValue, "Year");
    ifDateValid(MonthValue, "Month");
    ifDateValid(DayValue, "Day");
    if (TitleValue && ifDateValid(YearValue, "Year") && ifDateValid(MonthValue, "Month") && ifDateValid(DayValue, "Day") && ContentValue) {
        return true;
    } else {
        return false;
    }
}

FormDOM.addEventListener("submit", async (e) => {
    TitleValue = InputTitle.value;
    YearValue = InputYear.value;
    MonthValue = InputMonth.value;
    DayValue = InputDay.value;
    ContentValue = InputContent.value;

    e.preventDefault();
    if (ifInputEmpty()) {
        try {
            // use if to tell if it is post or patch
            await axios.post("/api/post", {
                title: TitleValue,
                year: YearValue,
                month: MonthValue,
                day: DayValue,
                content: ContentValue,
            })
            getAllTasks();
            ToggleInputInterface();
        } catch (err) {
            console.log(err);
        }

    }
})



function TaskEdit(){

}
