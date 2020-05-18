import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';
import 'zone.js/dist/zone';
import { OptionModule } from './option/module';
import { prod } from './env/environment';

if (prod) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(OptionModule)
  .then((module) =>
    fromEvent(window, 'unload').pipe(tap(() => module.destroy())),
  );
