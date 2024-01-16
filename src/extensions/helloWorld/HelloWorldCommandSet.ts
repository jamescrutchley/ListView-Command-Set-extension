import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  type Command,
  type IListViewCommandSetExecuteEventParameters,
  type ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHelloWorldCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const isPalindrome = (val: string): boolean => val.split('').reverse().join('') === val.split('').join('');

const LOG_SOURCE: string = 'HelloWorldCommandSet';

export default class HelloWorldCommandSet extends BaseListViewCommandSet<IHelloWorldCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized HelloWorldCommandSet');

    // initial state of the command's visibility
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    compareOneCommand.visible = false;

    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    return Promise.resolve();
  }

//   public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
//     switch (event.itemId) {
//       case 'COMMAND_1':
//         Dialog.alert(`${this.properties.sampleTextOne}`).catch((err) => {
//           Log.info(LOG_SOURCE, err)
//         });
//         break;
//       case 'COMMAND_2':
//         Dialog.alert(`${this.properties.sampleTextTwo}`).catch(() => {
//           /* handle error */
//         });
//         break;
//       default:
//         throw new Error('Unknown command');
//     }
//   }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
        Dialog.alert(`Clicked ${this.properties.sampleTextOne}`).catch(() => {
            //
        })
        break;
      case 'COMMAND_2':
        Dialog.prompt(`Some prompt`).then((value: string) => {
          Dialog.alert(isPalindrome(value) ? 'Palindrome!' : 'Not a palindrome!').catch(() => {
            //...
          })
        }).catch(() => {
            //...
        })
        break;
      default:
        throw new Error('Unknown command');
    }
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');

    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = this.context.listView.selectedRows?.length === 1;
    }

    // TODO: Add your logic here

    

    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  }
}
