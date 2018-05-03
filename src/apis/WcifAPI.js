export class WcifUpdater {
  constructor(component) {
    this.holder = component;
  }

  updateName(newName) {
    this.holder.setState({
      wcif: {
        ...this.holder.state.wcif,
        name: newName,
      },
    });
  }

  importWcif(newWcif, callback) {
    this.holder.setState({
      wcif: newWcif,
    }, callback);
  }
}

export const WcifUtils = {
}

