/**
 * Read record value or throw Promise if it's not resolved yet.
 */ export function readRecordValue(thenable) {
    // @ts-expect-error TODO: fix type
    if (thenable.status === "fulfilled") {
        // @ts-expect-error TODO: fix type
        return thenable.value;
    } else {
        throw thenable;
    }
}

//# sourceMappingURL=read-record-value.js.map