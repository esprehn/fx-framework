
/*
    Sends and observes notifications by broadcasting notify events.

    Usage:

    <fx-observer for="example" on-notify="{{ handleHashChange }}"></fx-observer>

    FxObserver.notify("example", relatedData);

    FxObserver.notifyAsync("example", relatedData).then(function() {
        // ...
    });
*/
@Element("fx-observer");
class FxObserver extends HTMLElement {
    @Event("notify");

    string for;

    void notify(optional Object data);
    Promise<void> notifyAsync(optional Object data);

    static void notify(string type, optional Object data);
    static Promise<void> notifyAsync(string type, option Object data);
}

/*
    Implements the monostate pattern. Allows notifying all instances of a
    given instanceType (tagName by default) of some event.

    Note that the default of tagName is not friendly to subclassing so you
    should specify an explicit instanceType if you expect your component to
    be subclassed.

    Usage:

    <polymer-element name="app-example" extends="fx-shared-instance">
        <template>
            ..
        </template>
        <script>
            Polymer({
                doStuff: function() {
                    this.notifyInstances({
                        data: // ...
                    });
                },
                notified: function(data) {
                    // do something with the notification.
                },
            });
        </script>
    </polymer-element>
*/
@Element("fx-shared-instance");
class FxSharedInstance extends HTMLElement {
    string instanceType;

    void notifyInstances(string method, optional Object data);
    Promise<void> notifyInstancesAsync(string method, optional Object data);

    Array getInstances();

    static getInstances(string instanceType);
    static void notify(string instanceType, string method, optional Object data);
    static Promise<void> notifyAsync(string instanceType, string method, optional Object data);
}

/*
    Listens for external elements and notifies locally. Target can be any window
    accessible property path, for example "document" or "screen.orientation". By
    default if no path is specified events are listened for on the window
    itself.

    The presence of an attribute that starts with "on-" will trigger a listener
    on the target for the event name following the dash. This works implicitly
    in polymer's declarative event handlers. If you're not using polymer, or are
    creating an element programatically you can add an attribute
    "on-{eventname}" to the element with no value.

    Usage:

    <fx-listener on-hashchange="{{ handleHashChange }}"></fx-listener>
*/
@Element("fx-listener");
class FxListener extends FxSharedInstance {
    string target;
}

/*
    Declares a route in a fx-view map. When the route path is matched the
    specified element will be created.

    Usage:

    <fx-route path="/issue/{id:\d+}" element="cr-issue-view"></fx-route>
*/
@Element("fx-route");
class FxRoute extends HTMLElement {
    string path;
    string element;
    Element createView(Object params);
    boolean matchPath(string path);
}

/*
    Declares the view map for an application. There should only be one per
    application. Components that want same domain links to instead route to
    views should embed a <fx-view-aware> component.

    Events:
        "viewchange": Before the view is changed.

    Usage:

    <fx-view>
        <fx-route path="/issue/{id:\d+}" element="cr-issue-view"></fx-route>
    </fx-view>
*/
@Element("fx-view");
class FxView extends HTMLElement {
    Element activeView;
    Promise<Element> createView();
    void loadRoute(string path);
}

/*
    Put this component inside other components that contain <a> elements
    (inside the same ShadowRoot) where clicks on those links should instead
    navigate to views instead of reloading the page.
*/
@Element("fx-view-aware");
class FxViewAware extends HTMLElement { }

/*
    Schedules work to execute, will run the passed function, and replace it
    with the newly returned function, repeatedly until the work runs out or
    the workLimit is reached in ms. If the limit is reached and there are still
    functions to run then it will schedule a completion with setTimeout.

    Usage:

    // asyncForEach is similar to:

    var i = 0;
    var array = [ ... ];
    function nextElement() {
        if (i >= array.length)
            return;
        process(array[i++]);
        return nextElement;
    }
    this.$.taskQueue.scheduleWork(nextElement);
*/
@Element("fx-task-queue");
class FxTaskQueue extends HTMLElement {
    number workLimit = 100; // ms
    number priority = 100;

    Promise<any> scheduleWork(function fn -> optional fn);
    Promise<any> asyncForEach(Array elements, function fn);
    void abort();

    static void delayQueues(number priority = -1);
    static void resumeQueues(number priority = -1);
}

/*
    Declares a web worker to execute async work. Supports the following worker
    message protocol:

    {
        type: string,
        data: any,
    }

    The worker will be killed when the element is detached unless disconnect()
    is called.

    Note that all messages sent with send() expect a reply by default and will
    reject without a "timeout" error after the specified timeout unless you
    specify noreply = true.

    Usage:

    <fx-worker id="worker">
        <script type="worker">
            onmessage = function(event) {
                
            };
        </script>
    </fx-worker>

    this.$.worker.send("doWork", [stuff]).then(function() {
        // ... done.
    });
*/
@Element("fx-worker");
class FxWorker extends HTMLElement {
    @Event("message");
    @Event("error");

    Worker worker;

    dictionary SendOptions {
        boolean noreply = false;
        number timeout = 100;
        Array transferList = [];
    }

    Promise<any> send(string type, optional Object data, optional SendOptions options);
    void disconnect();
}
