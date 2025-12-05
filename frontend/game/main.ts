
// To be implemented on front-end:
function on_student_leave()
{}

const GameDefaults = {
    students: 10,
    money: 0,
    day: 0,
    satisfaction: .5
}

const Constants = {
    DAILY_MONEY_PER_STUDENT: 100,
    INITIAL_MONEY_PER_STUDENT: 1000,
    RANDOM_DRIFT: .05,
    STUDENTS_MULT: 20,
    TIME_SCALE: 1.1
}

function random(base: number, scale: number, drift: number = Constants.RANDOM_DRIFT): number
{
    const drift_v = base * drift;
    let scaled = base * scale;
    const random_drift = Math.floor(Math.random() * drift_v);
    scaled += random_drift - Math.round(drift_v / 2);
    return scaled;
}

class GameEvent {
    constructor(public title: string, public body: string, public onEvent: (game: Game) => void) {
        this.title = title;
        this.body = body;
        this.onEvent = onEvent;
    }
}

const Events = [
    new GameEvent("Mise à jour Windows", "Une nouvelle version de windows est sortie et la précédente " +
        "n'est plus supportée. Il va falloir mettre à jour l'infrastructure système !",
        (game: Game) => {
            const totalPrice = random(300, Math.pow(Constants.TIME_SCALE, game.getCurrentDay()));
            game.cost(totalPrice);
            // TODO Yes-no form to be implemented
        }),
    new GameEvent("Panne de Cloudflare", "Une panne du service Cloudflare paralyse internet." +
        " Vos étudiants ne sont pas très contents...", (game: Game) => {
            const happinessLoss = random(10, 1);
            game.lose_satisfaction(happinessLoss);
        // TODO Yes-no form to be implemented
    })
]

class Game {
    private running: boolean = false;
    private money: number = 0;
    private satisfaction: number = 0;
    private teacher_satisfaction: number = 0;
    private students: number = 0;
    private teachers: number = 0;
    private day: number = 0;
    private seed: number = 0;
    private interval: number|undefined = undefined;

    getCurrentDay(){
        return this.day;
    }
    getMoney() {
        return this.money;
    }
    getStudents() {
        return this.students;
    }
    getTeachers() {
        return this.teachers;
    }
    getStudentSatisfaction() {
        return this.satisfaction;
    }
    getTeacherSatisfaction() {
        return this.teacher_satisfaction;
    }

    cost(n: number) {
        this.money -= n;
    }
    lose_satisfaction(n: number) {
        this.satisfaction -= n;
    }

    setup() {
        this.running = false;
        this.interval = undefined;
        this.money = GameDefaults.students * Constants.INITIAL_MONEY_PER_STUDENT;
        this.satisfaction = 0.9;
        this.teacher_satisfaction = 0.9;
        this.day = 0;
        this.students = 10;
        this.teachers = 1;
        this.seed = 0;
    }
    begin() {
        this.running = true;
        // @ts-expect-error non-node env
        this.interval = setInterval(() => {
            // Game tick
            if (!this.running)
                return;
            const dayLast = this.day;
            this.day += .1;
            if (dayLast != Math.floor(this.day)) {
                // New day!
                this.next_day();
            }
        }, 1000);
    }
    end_game() {
        clearInterval(this.interval);
        this.running = false;
        this.interval = undefined;
    }
    add_student() {
        // Check whether the school is deemed "full" or not...
        const max = (this.satisfaction * 20) * Constants.STUDENTS_MULT;
        if (this.students >= max)
            return on_student_leave();
        this.students++;
        this.money += Constants.DAILY_MONEY_PER_STUDENT;
    }
    next_day() {
        if (!this.running)
            return;
        this.money += Math.floor(random(Constants.DAILY_MONEY_PER_STUDENT * this.students, 1, Constants.RANDOM_DRIFT));
        // Decide if we have a new event
        if (Math.random() > 0.5) {
            const newevent = Events[Math.floor(Math.random() * Events.length)];
            newevent.onEvent(this);
        }
        // Have we lost ?
        if (this.students < 1 || this.money < 1 || this.satisfaction < .01) {
            this.end_game(); // Game over
        }
    }

}

const GameInstance: Game = new Game();

export {
    GameInstance,
    Game,
    GameEvent,
    GameDefaults,
    Events,
    Constants
}

/*

const Game = {
    running: 0,
    money: 0,
    students: 0,
    satisfaction: 0,
    day: 0,
    seed: 0,
    current_events: [],
    
    setup: () => {
        Game.running = 0;
        Game.money = GameDefaults.money;
        Game.day = GameDefaults.day;
        Game.satisfaction = GameDefaults.satisfaction;
    },
    begin: () => {
        Game.running = 1;
    },
    next_day: () => {
        Game.day += 1;
        Game.students += random(Constants.STUDENTS_MULT * Game.satisfaction, 1, Constants.RANDOM_DRIFT);
        Game.money += random(Constants.DAILY_MONEY_PER_STUDENT * Game.students, 1, Constants.RANDOM_DRIFT);

    }
}

*/
