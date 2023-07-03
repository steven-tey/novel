import chalk from "next/dist/compiled/chalk";
import stripAnsi from "next/dist/compiled/strip-ansi";
import textTable from "next/dist/compiled/text-table";
import createStore from "next/dist/compiled/unistore";
import formatWebpackMessages from "../../client/dev/error-overlay/format-webpack-messages";
import { store as consoleStore } from "./store";
import { COMPILER_NAMES } from "../../shared/lib/constants";
export function startedDevelopmentServer(appUrl, bindAddr) {
    consoleStore.setState({
        appUrl,
        bindAddr
    });
}
export function formatAmpMessages(amp) {
    let output = chalk.bold("Amp Validation") + "\n\n";
    let messages = [];
    const chalkError = chalk.red("error");
    function ampError(page, error) {
        messages.push([
            page,
            chalkError,
            error.message,
            error.specUrl || ""
        ]);
    }
    const chalkWarn = chalk.yellow("warn");
    function ampWarn(page, warn) {
        messages.push([
            page,
            chalkWarn,
            warn.message,
            warn.specUrl || ""
        ]);
    }
    for(const page in amp){
        let { errors , warnings  } = amp[page];
        const devOnlyFilter = (err)=>err.code !== "DEV_MODE_ONLY";
        errors = errors.filter(devOnlyFilter);
        warnings = warnings.filter(devOnlyFilter);
        if (!(errors.length || warnings.length)) {
            continue;
        }
        if (errors.length) {
            ampError(page, errors[0]);
            for(let index = 1; index < errors.length; ++index){
                ampError("", errors[index]);
            }
        }
        if (warnings.length) {
            ampWarn(errors.length ? "" : page, warnings[0]);
            for(let index = 1; index < warnings.length; ++index){
                ampWarn("", warnings[index]);
            }
        }
        messages.push([
            "",
            "",
            "",
            ""
        ]);
    }
    if (!messages.length) {
        return "";
    }
    output += textTable(messages, {
        align: [
            "l",
            "l",
            "l",
            "l"
        ],
        stringLength (str) {
            return stripAnsi(str).length;
        }
    });
    return output;
}
const buildStore = createStore({
    // @ts-expect-error initial value
    client: {},
    // @ts-expect-error initial value
    server: {},
    // @ts-expect-error initial value
    edgeServer: {}
});
let buildWasDone = false;
let clientWasLoading = true;
let serverWasLoading = true;
let edgeServerWasLoading = false;
buildStore.subscribe((state)=>{
    const { amp , client , server , edgeServer , trigger  } = state;
    const { appUrl  } = consoleStore.getState();
    if (client.loading || server.loading || (edgeServer == null ? void 0 : edgeServer.loading)) {
        consoleStore.setState({
            bootstrap: false,
            appUrl: appUrl,
            loading: true,
            trigger
        }, true);
        clientWasLoading = !buildWasDone && clientWasLoading || client.loading;
        serverWasLoading = !buildWasDone && serverWasLoading || server.loading;
        edgeServerWasLoading = !buildWasDone && edgeServerWasLoading || edgeServer.loading;
        buildWasDone = false;
        return;
    }
    buildWasDone = true;
    let partialState = {
        bootstrap: false,
        appUrl: appUrl,
        loading: false,
        typeChecking: false,
        partial: clientWasLoading && (serverWasLoading || edgeServerWasLoading) ? "client and server" : undefined,
        modules: (clientWasLoading ? client.modules : 0) + (serverWasLoading ? server.modules : 0) + (edgeServerWasLoading ? (edgeServer == null ? void 0 : edgeServer.modules) || 0 : 0),
        hasEdgeServer: !!edgeServer
    };
    if (client.errors && clientWasLoading) {
        // Show only client errors
        consoleStore.setState({
            ...partialState,
            errors: client.errors,
            warnings: null
        }, true);
    } else if (server.errors && serverWasLoading) {
        consoleStore.setState({
            ...partialState,
            errors: server.errors,
            warnings: null
        }, true);
    } else if (edgeServer.errors && edgeServerWasLoading) {
        consoleStore.setState({
            ...partialState,
            errors: edgeServer.errors,
            warnings: null
        }, true);
    } else {
        // Show warnings from all of them
        const warnings = [
            ...client.warnings || [],
            ...server.warnings || [],
            ...edgeServer.warnings || []
        ].concat(formatAmpMessages(amp) || []);
        consoleStore.setState({
            ...partialState,
            errors: null,
            warnings: warnings.length === 0 ? null : warnings
        }, true);
    }
});
export function ampValidation(page, errors, warnings) {
    const { amp  } = buildStore.getState();
    if (!(errors.length || warnings.length)) {
        buildStore.setState({
            amp: Object.keys(amp).filter((k)=>k !== page).sort()// eslint-disable-next-line no-sequences
            .reduce((a, c)=>(a[c] = amp[c], a), {})
        });
        return;
    }
    const newAmp = {
        ...amp,
        [page]: {
            errors,
            warnings
        }
    };
    buildStore.setState({
        amp: Object.keys(newAmp).sort()// eslint-disable-next-line no-sequences
        .reduce((a, c)=>(a[c] = newAmp[c], a), {})
    });
}
export function watchCompilers(client, server, edgeServer) {
    buildStore.setState({
        client: {
            loading: true
        },
        server: {
            loading: true
        },
        edgeServer: {
            loading: true
        },
        trigger: "initial"
    });
    function tapCompiler(key, compiler, onEvent) {
        compiler.hooks.invalid.tap(`NextJsInvalid-${key}`, ()=>{
            onEvent({
                loading: true
            });
        });
        compiler.hooks.done.tap(`NextJsDone-${key}`, (stats)=>{
            buildStore.setState({
                amp: {}
            });
            const { errors , warnings  } = formatWebpackMessages(stats.toJson({
                preset: "errors-warnings",
                moduleTrace: true
            }));
            const hasErrors = !!(errors == null ? void 0 : errors.length);
            const hasWarnings = !!(warnings == null ? void 0 : warnings.length);
            onEvent({
                loading: false,
                modules: stats.compilation.modules.size,
                errors: hasErrors ? errors : null,
                warnings: hasWarnings ? warnings : null
            });
        });
    }
    tapCompiler(COMPILER_NAMES.client, client, (status)=>{
        if (!status.loading && !buildStore.getState().server.loading && !buildStore.getState().edgeServer.loading) {
            buildStore.setState({
                client: status,
                trigger: undefined
            });
        } else {
            buildStore.setState({
                client: status
            });
        }
    });
    tapCompiler(COMPILER_NAMES.server, server, (status)=>{
        if (!status.loading && !buildStore.getState().client.loading && !buildStore.getState().edgeServer.loading) {
            buildStore.setState({
                server: status,
                trigger: undefined
            });
        } else {
            buildStore.setState({
                server: status
            });
        }
    });
    tapCompiler(COMPILER_NAMES.edgeServer, edgeServer, (status)=>{
        if (!status.loading && !buildStore.getState().client.loading && !buildStore.getState().server.loading) {
            buildStore.setState({
                edgeServer: status,
                trigger: undefined
            });
        } else {
            buildStore.setState({
                edgeServer: status
            });
        }
    });
}
export function reportTrigger(trigger) {
    buildStore.setState({
        trigger
    });
}

//# sourceMappingURL=index.js.map