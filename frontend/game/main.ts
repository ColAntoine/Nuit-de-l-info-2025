
// To be implemented on front-end:
function open_dialog(title: string, body: string, buttons)
{}

function on_student_leave()
{}

const GameDefaults = {
    students: 10,
    money: 200,
    day: 0,
    satisfaction: .5
}

const Constants = {
    DAILY_MONEY_PER_STUDENT: 100,
    INITIAL_MONEY_PER_STUDENT: 50,
    RANDOM_DRIFT: .05,
    STUDENTS_MULT: 5,
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
    private running: boolean;
    constructor(public title: string, public body: string, public update: (game: Game) => void) {
        this.title = title;
        this.body = body;
        this.update = update;
        this.running = true;
    }
    isRunning() {
        return this.running;
    }
}

const Events = [
    new GameEvent("Mise à jour Windows", "Une nouvelle version de windows est sortie et la précédente " +
        "n'est plus supportée. Il va falloir mettre à jour l'infrastructure système !",
        (game: Game) => {
            const totalPrice = random(300, Math.pow(Constants.TIME_SCALE, game.getCurrentDay()));
            game.cost(totalPrice);
        }),
    new GameEvent("Panne de Cloudflare", "Une panne du service Cloudflare paralyse internet." +
        " Vos étudiants ne sont pas très contents...", (game: Game) => {
            const happinessLoss = random(10, 1);
            game.lose_satisfaction(happinessLoss);
    })
]

class Game {
    private running: boolean = false;
    private money: number = 0;
    private satisfaction: number = 0;
    private students: number = 0;
    private day: number = 0;
    private seed: number = 0;
    private events: GameEvent[] = [];

    getCurrentDay(){
        return this.day;
    }
    cost(n: number) {
        this.money -= n;
    }
    lose_satisfaction(n: number) {
        this.satisfaction -= n;
    }

    setup() {
        this.running = false;
        this.money = 100;
        this.satisfaction = 0.5;
        this.day = 0;
        this.students = 10;
        this.seed = 0;
        this.events = [];
    }
    begin() {
        this.running = true;
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
        this.day += 1;
        this.money += random(Constants.DAILY_MONEY_PER_STUDENT * this.students, 1, Constants.RANDOM_DRIFT);
        for (const gameevt of this.events) {
            if (gameevt.isRunning()) gameevt.update(this);
        }
        // Decide if we have a new event
    }

}

const GameInstance: Game = new Game();
GameInstance.setup();

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
