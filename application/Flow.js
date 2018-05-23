import { uuid, deleteFromArray, map } from 'substance'

const UUID = uuid()

export default class Flow {
  constructor (stages) {
    // temporal stages
    this._stages = stages

    let stageIndex = {}
    stages.forEach((name, idx) => {
      stageIndex[name] = idx
    })
    this._stageIndex = stageIndex
    // registry for symbols mapping to the stage when they are produced
    this._symbols = new Map()
    // slots represents a combination of symbols
    // for which observers and reducers register to
    let slots = {}
    stages.forEach(name => {
      slots[name] = {}
    })
    this._slots = slots
    // how symbols depend on each other (via reducers)
    this._deps = {}
    // a 2D matrix of slots which represents a correct
    // order according to deps introduced by reducers
    this._schedule = []
    // updates applied to the app-state
    // e.g. old vs. new value, or a diff,
    // or e.g. DocumentChange
    this._updates = {}
  }

  /*
    Low-level API to add an observer to the slot for a specific symbol
  */
  registerObserver (symbols, observer, stage) {
    symbols.sort()
    let id = symbols.toString()
    let earliestStageIdx = this._getStageIdx(symbols)
    if (stage) {
      let stageIdx = this._stageIndex.get(stage)
      if (stageIdx < earliestStageIdx) {
        throw new Error('Symbols are produced at a later stage')
      }
    } else {
      stage = this._stages[earliestStageIdx]
    }
    let slot = this._slots[stage][id]
    if (!slot) {
      this._slots[stage][id] = new Slot(symbols, stage)
      // TODO: instead of invalidating we could also try to update it
      this._invalidateSchedule()
    }
    if (!observer.hasOwnProperty(UUID)) {
      observer[UUID] = { subscribedSlots: [] }
    }
    slot.observers.push(observer)
    observer[UUID].subscribedSlots.push(slot)
  }

  // a reducer is basically an observer but by declaring
  // how it affects the app-state we are able to
  // figure out a correct order of calling observers and reducers
  // automatically
  registerReducer (inputs, outputs, stage, reducer) {
    const symbols = this._symbols
    const deps = this._deps
    outputs.forEach(s => {
      if (symbols.has(s)) throw new Error('Symbol is already provided by a different reducer')
    })
    let earliestStageIdx = this._getStageIdx(symbols)
    let stageIdx = this._stageIndex.get(stage)
    if (stageIdx < earliestStageIdx) {
      throw new Error('Symbols are produced at a later stage')
    }
    this.registerObserver(inputs, reducer, stage)
    // TODO: we could consider the stage when a symbol is reduced
    // and disallow observing before that stage
    outputs.forEach(s => {
      symbols.set(s, stage)
      deps[s] = inputs.slice()
    })
    // TODO: instead of invalidating we could also try to update it
    this._invalidateSchedule()
  }

  unregisterObserver (observer) {
    // remove
    let subscribedSlots = observer[UUID].subscribedSlots
    for (let i = 0; i < subscribedSlots.length; i++) {
      let slot = subscribedSlots[i]
      deleteFromArray(slot.observers, observer)
    }
    delete observer[UUID]
  }

  performFlow () {
    let schedule = this._schedule
    if (!schedule) schedule = this._computeSchedule()
    for (let i = 0; i < schedule.length; i++) {
      this._processStage(schedule[i])
    }
  }

  /*
    @returns this stage at which all symbols are ready.
  */
  _getStageIdx (symbols) {
    let stageIdx = 0
    symbols.forEach(s => {
      if (this._symbols.has(s)) throw new Error(`Unknown symbol ${s}`)
      stageIdx = Math.max(stageIdx, this._symbols.get(s))
    })
    return stageIdx
  }

  _processStage (stage) {
    for (let i = 0; i < stage.length; i++) {
      this._processSlot(stage[i])
    }
  }

  _processSlot (slot) {
    let update = {}
    let needsUpdate = false
    for (let i = 0; i < slot.symbols.length; i++) {
      let s = slot.symbols[i]
      if (this._isDirty(s)) {
        update[s] = this._updates[s]
        needsUpdate = true
      }
    }
    if (needsUpdate) {
      for (let i = 0; i < slot.observers.length; i++) {
        let observer = slot.observers[i]
        observer.update(update)
      }
    }
  }

  _isDirty (symbol) {
    return this._updates.hasOwnProperty(symbol)
  }

  _invalidateSchedule () {
    this._schedule = null
  }

  _computeSchedule () {
    let symbolLevels = {}
    let schedule = []
    this._stages.forEach(stage => {
      // compute level for each slot
      let slots = map(this._slots[stage], (slot) => {
        this._computeSlotLevel(slot, symbolLevels)
        return slot
      })
      // sort the slot in order of their level
      slots.sort((a, b) => a.level - b.level)
      schedule.push(slots)
    })
    this._schedule = schedule
    return schedule
  }

  _computeSlotLevel (slot, symbolLevels) {
    let _levels = slot.symbols.map(s => this._computeSymbolLevel(s, symbolLevels, new Set()))
    slot.level = Math.max(..._levels)
  }

  _computeSymbolLevel (s, symbolLevels, visiting) {
    if (symbolLevels.hasOwnProperty(s)) return symbolLevels[s]
    if (visiting.has(s)) throw new Error('Cyclic dependency detected')
    visiting.add(s)
    let deps = this._deps[s]
    let level
    if (!deps) {
      level = 0
    } else {
      let _levels = deps.map(s => this._computeSymbolLevel(s, symbolLevels, visiting))
      level = Math.max(..._levels) + 1
    }
    symbolLevels[s] = level
    visiting.delete(s)
    return level
  }
}

class Slot {
  constructor (symbols) {
    this.symbols = symbols
    this.observers = []
  }
}
