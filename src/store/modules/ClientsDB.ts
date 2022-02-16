import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { ClientsDB } from '@/modules/ClientsDB';
import store from '..';

@Module({ namespaced: true, name: 'Clients' })
class Clients extends VuexModule {
  public value = window.electron.clients.get();
  @Mutation
  public setName(newt: ClientsDB): void {
    this.value = newt;
  }
  @Action
  public updateName(newName: string): void {
    this.context.commit('setName', newName)
  }
}
export default Clients

window.electron.ipc.receive("clients-changed", (event:any) => {
  store.commit("Clients/setName", event)
  console.log("changed", store.state.Clients.value)
  // getModule(ClientsDBVuex)?.mutations?.setName(event);
});