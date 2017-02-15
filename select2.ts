import { bindable, bindingMode, autoinject, customElement } from 'aurelia-framework';
import 'jquery';
import 'select2';

@customElement('select2') 
@autoinject
export class Select2 {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) name:string = 'select';
    @bindable({ defaultBindingMode: bindingMode.twoWay }) labelproperty: string = 'label';
    @bindable({ defaultBindingMode: bindingMode.twoWay }) valueproperty: string = 'value';
    @bindable({ defaultBindingMode: bindingMode.twoWay }) options: any[] = []; 
    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'selectedIsChanged' }) selected: any = null; 

    select2 = null;
    constructor(private element: Element) {}


    selectedIsChanged() {
        if (this.select2 != null) {
            this.select2.val(this.selected).trigger("change");
        }
    }

    attached() {

        this.select2 = $(this.element).find('select').select2(); //Create the select2 dropdown
        this.select2.val(this.selected).trigger("change"); //Select the one that is set to default select.

        this.select2.on('change', evt => {

            if (this.selected != $(evt.delegateTarget.selectedOptions).val() && $(evt.delegateTarget.selectedOptions).val() !== undefined)
                this.selected = $(evt.delegateTarget.selectedOptions).val();

            if (evt.originalEvent) {
                return;
            }
            this.element.dispatchEvent(new Event('change'));
        });
    };
 
    detached() {
        this.select2.select2('destroy');
    }
}
