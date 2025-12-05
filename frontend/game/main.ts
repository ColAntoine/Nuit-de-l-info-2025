// To be implemented on front-end:
export function open_dialog(title: string, body: string, buttons: any) {
    // TODO: implémenter côté front
  }
  
  export function on_student_leave() {
    // TODO: implémenter côté front
  }
  
  const GameDefaults = {
    students: 10,
    money: 0,
    day: 0,
    satisfaction: 0.5,
  };
  
  const Constants = {
    DAILY_MONEY_PER_STUDENT: 100,
    INITIAL_MONEY_PER_STUDENT: 1000,
    RANDOM_DRIFT: 0.05,
    STUDENTS_MULT: 20,
    TIME_SCALE: 1.1,
  };
  
  function random(
    base: number,
    scale: number,
    drift: number = Constants.RANDOM_DRIFT
  ): number {
    const drift_v = base * drift;
    let scaled = base * scale;
    const random_drift = Math.floor(Math.random() * drift_v);
    scaled += random_drift - Math.round(drift_v / 2);
    return scaled;
  }
  
  class GameEvent {
    private running: boolean;
    constructor(
      public title: string,
      public body: string,
      public update: (game: Game) => void
    ) {
      this.title = title;
      this.body = body;
      this.update = update;
      this.running = true;
    }
    isRunning() {
      return this.running;
    }
  }
  
  export type EventConfig = {
    name: string;
    cost: number;
    satisfaction: number; // "points" (sera divisé par 100 pour la satisfaction)
  };
  
  const EventsCatalog: EventConfig[] = [
    { name: "404 Con found", cost: 90, satisfaction: 8 },
    { name: "Aperomix", cost: 10, satisfaction: 5 },
    { name: "Fete de la musique", cost: 120, satisfaction: 10 },
    { name: "Summit", cost: 60, satisfaction: 4 },
    { name: "JPO", cost: 15, satisfaction: 3 },
    { name: "Ice Breaker", cost: 10, satisfaction: 1 },
    { name: "AfterWork", cost: 8, satisfaction: 2 },
    { name: "WEI", cost: 100, satisfaction: 5 },
    { name: "WED", cost: 100, satisfaction: 5 },
    { name: "WES (ski)", cost: 100, satisfaction: 5 },
    { name: "Tournoi foot", cost: 7, satisfaction: 2 },
    { name: "Tournoi Basket", cost: 8, satisfaction: 2 },
    { name: "Tournoi jeu vidéo", cost: 2, satisfaction: 1 },
  ];
  
  const BigtekCatalog: EventConfig[] = [
    { name: "Windows", cost: 40, satisfaction: 2 },
    { name: "AWS", cost: 100, satisfaction: 1 },
    { name: "Apple", cost: 10, satisfaction: 1 },
    { name: "Google", cost: 20, satisfaction: 2 },
    { name: "Microsoft", cost: 80, satisfaction: 1 },
    { name: "Nvidia", cost: 30, satisfaction: 1 },
    { name: "IA", cost: 10, satisfaction: 3 },
    { name: "cloudfare", cost: 100, satisfaction: 2 },
    { name: "Epic games", cost: 15, satisfaction: 2 },
    { name: "valve", cost: 5, satisfaction: 2 },
    { name: "nintendo", cost: 5, satisfaction: 1 },
  ];
  
  export type BigtekErrorConfig = {
    name: string;
    error: string;
    cost: number;
    satisfaction: number; // négatif
  };
  
  const BigtekErrors: BigtekErrorConfig[] = [
    {
      name: "Windows",
      error: "Windows 10 n'est plus valide, veuillez passer sur Windows 11",
      cost: 20,
      satisfaction: -7,
    },
    {
      name: "AWS",
      error: "Version AWS CLI obsolète, mise à jour requise",
      cost: 10,
      satisfaction: -5,
    },
    {
      name: "Apple",
      error: "Version macOS trop ancienne pour XCode",
      cost: 15,
      satisfaction: -6,
    },
    {
      name: "Google",
      error: "API dépréciée, migration nécessaire",
      cost: 5,
      satisfaction: -3,
    },
    {
      name: "Microsoft",
      error: "Licence expirée, renouvellement obligatoire",
      cost: 30,
      satisfaction: -6,
    },
    {
      name: "Nvidia",
      error: "Driver GPU obsolète, mise à jour requise",
      cost: 10,
      satisfaction: -3,
    },
    {
      name: "IA",
      error: "Modèle IA trop ancien, précision insuffisante",
      cost: 25,
      satisfaction: -10,
    },
    {
      name: "cloudfare",
      error: "Configuration DNS invalide",
      cost: 20,
      satisfaction: -8,
    },
    {
      name: "Epic games",
      error: "SDK obsolète pour le moteur Unreal",
      cost: 15,
      satisfaction: -3,
    },
    {
      name: "valve",
      error: "Steam API deprecated",
      cost: 5,
      satisfaction: -2,
    },
    {
      name: "nintendo",
      error: "SDK Switch non mis à jour",
      cost: 10,
      satisfaction: -3,
    },
  ];
  
  const Events = [
    new GameEvent(
      "Mise à jour Windows",
      "Une nouvelle version de windows est sortie et la précédente n'est plus supportée. Il va falloir mettre à jour l'infrastructure système !",
      (game: Game) => {
        const totalPrice = random(
          300,
          Math.pow(Constants.TIME_SCALE, game.getCurrentDay())
        );
        game.cost(totalPrice);
      }
    ),
    new GameEvent(
      "Panne de Cloudflare",
      "Une panne du service Cloudflare paralyse internet. Vos étudiants ne sont pas très contents...",
      (game: Game) => {
        const happinessLoss = random(10, 1);
        game.lose_satisfaction(happinessLoss);
      }
    ),
  ];
  
  class Game {
    private running: boolean = false;
    private money: number = 0;
    private satisfaction: number = 0;
    private teacher_satisfaction: number = 0;
    private students: number = 0;
    private teachers: number = 0;
    private day: number = 0;
    private seed: number = 0;
    private events: GameEvent[] = [];
  
    getCurrentDay() {
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
  
    gain(n: number) {
      this.money += n;
    }
  
    gain_satisfaction(n: number) {
      this.satisfaction += n;
    }
  
    lose_satisfaction(n: number) {
      this.satisfaction -= n;
    }
  
    setup() {
      this.running = false;
      this.money = GameDefaults.students * Constants.INITIAL_MONEY_PER_STUDENT;
      this.satisfaction = 0.6; // < 0.65 donc on ne peut pas recruter au début → tu peux mettre 0.8 si tu veux
      this.teacher_satisfaction = 0.8;
      this.day = 0;
      this.students = 10;
      this.teachers = 1;
      this.seed = 0;
      this.events = [];
    }
  
    begin() {
      this.running = true;
    }
  
    add_student() {
      // Hard cap : 100 élèves max
      if (this.students >= 100) {
        return; // rien ne se passe
      }
  
      // Si satisfaction < 65% : on ne peut plus recruter
      if (this.satisfaction < 0.65) {
        return;
      }
  
      this.students++;
      this.money += Constants.DAILY_MONEY_PER_STUDENT;
    }
  
    next_day() {
      this.day += 1;
  
      // gain d'argent journalier
      this.money += random(
        Constants.DAILY_MONEY_PER_STUDENT * this.students,
        1,
        Constants.RANDOM_DRIFT
      );
  
      // mise à jour des events systémiques
      for (const gameevt of this.events) {
        if (gameevt.isRunning()) gameevt.update(this);
      }
  
      // 🔥 Perte d'élèves si satisfaction < 50%, de plus en plus violente avec le temps
      if (this.satisfaction < 0.5 && this.students > 0) {
        const severity = 0.5 - this.satisfaction; // entre 0 et 0.5
  
        // facteur de difficulté : plus le jour augmente, plus c'est violent
        // jour 0 → x1, jour 40 → x2, jour 80 → x3, etc.
        const difficultyFactor = 1 + this.day / 40;
  
        let loseCount = Math.round(severity * 20 * difficultyFactor);
  
        if (loseCount < 1) loseCount = 1; // si on est < 50%, on en perd au moins 1
        loseCount = Math.min(loseCount, this.students);
  
        this.students -= loseCount;
  
        // perte de satisfaction supplémentaire
        this.satisfaction -= loseCount * 0.001;
        if (this.satisfaction < 0) {
          this.satisfaction = 0;
        }
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
    Constants,
    EventsCatalog,
    BigtekCatalog,
    BigtekErrors,
  };
  