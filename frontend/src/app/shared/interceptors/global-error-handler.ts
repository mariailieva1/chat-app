
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private snackBar: MatSnackBar) { }

    handleError(error: Error | { message?: string } | string): void {
        if (error instanceof HttpErrorResponse) {
            this.snackBar.open(error.error.message, 'Close', { verticalPosition: 'top', duration: 5000 })
        }
    }
}
