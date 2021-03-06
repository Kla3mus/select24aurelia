import { bindable, bindingMode, autoinject, customElement } from 'aurelia-framework';
import 'jquery';
import 'select2';

@customElement('select2') 
@autoinject
export class Select2Thing {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) name:string = 'select';
    @bindable({ defaultBindingMode: bindingMode.twoWay }) labelproperty: string = 'label';
    @bindable({ defaultBindingMode: bindingMode.twoWay }) valueproperty: string = 'value';
    @bindable({ defaultBindingMode: bindingMode.twoWay }) multiselect: string = "false";

    @bindable({ defaultBindingMode: bindingMode.twoWay }) options: any[] = []; 
    @bindable({ defaultBindingMode: bindingMode.twoWay, changeHandler: 'selectedIsChanged' }) selected: any = null; 

    select2 = null;
    constructor(private element: Element) {
    }

    selectedIsChanged() {
        if (this.select2 != null) {
            if (this.shouldISetSelected()) {
                if (this.multiselect == "true") {
                    if (this.selected.constructor === Array)
                        this.select2.val(this.selected).trigger("change");
                    else
                        this.select2.val([this.selected]).trigger("change");
                }
                else {
                    if (!isNaN(this.selected))
                        this.select2.val(parseInt(this.selected)).trigger("change");
                }
            }
        }
    }

    private getMultiValues() {
        let select = [];
        if (this.select2.val() == null)
            return select;

        for (let e of this.select2.val()) {
            select.push(parseInt(e));
        }
        return select;
    }

    private getSingleValue() {
        let value = this.select2.val();
        if (value == null || value === "")
            return null;
        return parseInt(value);
    }

    private shouldISetSelected() {
        if (this.multiselect == "true") {
            let mh = this.getMultiValues();
            if (JSON.stringify(this.selected.sort()) === JSON.stringify(mh.sort())) {
                return false;
            }
            return true;
        }
        else {
            if (this.selected !== NaN && this.selected != this.select2.val() && this.select2.val() !== undefined) {
                return true;
            }
            return false;
        }
    }

    attached() {

        //Create the select2 dropdown
        this.select2 = $(this.element).find('select').select2({
            placeholder: "No selection",
            allowClear: true
        }); 

        this.select2.val(this.selected).trigger("change"); //Select the one that is set to default select.

        this.select2.on('change', evt => {

            if (this.shouldISetSelected()) {
                if (this.multiselect == "true")
                    this.selected = this.getMultiValues();
                else 
                    this.selected = this.getSingleValue();
            }
        });
    };
 
    detached() {
        this.select2.select2('destroy');
    }
}
