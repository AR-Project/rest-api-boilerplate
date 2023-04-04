interface IDependency {
  generate: () => string
}

interface IMain {
  addSentence: () => string
}

// --- Second File

class DependencyClassImplemented implements IDependency {
  generate(): string {
    return 'This is a sentence'
  }
}


// ---- Third File

class Main implements IMain {
  _dependency: IDependency
  constructor(dependency: IDependency) {
    this._dependency = dependency
  }

  addSentence(): string {
    return `${this._dependency.generate()} and added in My Other Class`
  }
}



