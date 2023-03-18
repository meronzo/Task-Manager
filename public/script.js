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
const InputMonth = document.querySelector("#Month");
const InputDate = document.querySelector("#Date");
const InputContent = document.querySelector("#Content");

let TitleValue = "";
let MonthValue = "";
let DateValue = "";
let ContentValue = "";

/*  Output all data from database  */
const getAllTasks = async () => {
    try {
        /*  Fetch data  */
        let allTasks = await axios.get("/api/get");
        let { data } = allTasks;

        /*  Write on DOM    */
        allTasks = data.map((task) => {
            let { title, month, date, content } = task;
            return `
            <section class="Task">
                <article class="TaskHeader TaskChild">
                    <div class="TaskIcon">
                        <span class="Triangle">▶</span>
                    </div>
                    <h3 class="TaskTitle">${title}</h3>
                    <h4 class="TaskDate">${month}/${date}</h4>
                </article>
                <article class="TaskContent">
                    <article class="TaskExplanation TaskChild">
                        ${content}
                    </article>
                    <div class="TaskCommands TaskChild">
                        <button><i class="fa-regular fa-pen-to-square"></i></button>
                        <button><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </article>
            </section>
            `
        }).join("");
        console.log(allTasks);
        TasksContainer.innerHTML = allTasks;
        AddHeaderEvent();
    } catch (err) {
        console.log(err);
    }
}
getAllTasks();

/*  Post Data from Form   */
InputTitle.addEventListener("change", (e) => {
    TitleValue = e.target.value;
})
InputMonth.addEventListener("change", (e) => {
    MonthValue = e.target.value;
})
InputDate.addEventListener("change", (e) => {
    DateValue = e.target.value;
})
InputContent.addEventListener("change", (e) => {
    ContentValue = e.target.value;
});
FormDOM.addEventListener("submit", async (e) => {
    if (TitleValue && MonthValue && DateValue && ContentValue) {
        try {
            let PostTask = await axios.post("/api/post", {
                title: TitleValue,
                month: MonthValue,
                date: DateValue,
                content: ContentValue,
            })
            getAllTasks();
        } catch (err) {
            console.log(err);
        }
    }
})

