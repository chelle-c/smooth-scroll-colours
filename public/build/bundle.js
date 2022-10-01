
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.50.1 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i].id;
    	child_ctx[15] = list[i].image;
    	child_ctx[16] = list[i].alt;
    	return child_ctx;
    }

    // (81:1) {#each [...sections].reverse() as { id, image, alt }}
    function create_each_block(ctx) {
    	let section;
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let h3;
    	let t1;
    	let t2_value = /*id*/ ctx[14] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			h3 = element("h3");
    			t1 = text("Section #");
    			t2 = text(t2_value);
    			attr_dev(img, "class", "w-96 rounded-lg");
    			if (!src_url_equal(img.src, img_src_value = "/images/image-" + /*image*/ ctx[15] + ".jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[16]);
    			add_location(img, file, 86, 4, 2043);
    			attr_dev(div, "class", "drop-shadow-2xl");
    			add_location(div, file, 85, 3, 2009);
    			attr_dev(h3, "class", "font-sans font-bold text-2xl p-6");
    			add_location(h3, file, 92, 3, 2145);
    			attr_dev(section, "id", "section" + /*id*/ ctx[14]);
    			attr_dev(section, "class", "min-w-full min-h-screen");
    			add_location(section, file, 81, 2, 1938);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, img);
    			append_dev(section, t0);
    			append_dev(section, h3);
    			append_dev(h3, t1);
    			append_dev(h3, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(81:1) {#each [...sections].reverse() as { id, image, alt }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div0;
    	let t0;
    	let main;
    	let div3;
    	let div1;
    	let h1;
    	let t2;
    	let div2;
    	let t4;
    	let t5;
    	let div6;
    	let div4;
    	let a0;
    	let t7;
    	let div5;
    	let ul;
    	let li0;
    	let a1;
    	let t9;
    	let li1;
    	let a2;
    	let t11;
    	let li2;
    	let a3;
    	let t13;
    	let li3;
    	let a4;
    	let t15;
    	let li4;
    	let a5;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[6]);
    	let each_value = [.../*sections*/ ctx[4]].reverse();
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			main = element("main");
    			div3 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Scroll & Colours";
    			t2 = space();
    			div2 = element("div");
    			div2.textContent = "Made with Svelte and Tailwind CSS";
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div6 = element("div");
    			div4 = element("div");
    			a0 = element("a");
    			a0.textContent = "Project Idea";
    			t7 = space();
    			div5 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "Section #5";
    			t9 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Section #4";
    			t11 = space();
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "Section #3";
    			t13 = space();
    			li3 = element("li");
    			a4 = element("a");
    			a4.textContent = "Section #2";
    			t15 = space();
    			li4 = element("li");
    			a5 = element("a");
    			a5.textContent = "Section #1";
    			attr_dev(div0, "id", "background");
    			attr_dev(div0, "class", "bgDisplay min-w-full min-h-screen z-0 absolute");
    			set_style(div0, "transition", "background-color 1.5s");
    			set_style(div0, "background-color", /*bgColour*/ ctx[3]);
    			add_location(div0, file, 55, 0, 1244);
    			attr_dev(h1, "class", "font-sans font-bold text-5xl uppercase");
    			add_location(h1, file, 71, 3, 1691);
    			add_location(div1, file, 70, 2, 1682);
    			attr_dev(div2, "class", "font-sans font-bold text-xl");
    			add_location(div2, file, 75, 2, 1784);
    			attr_dev(div3, "class", "min-w-full p-6 flex flex-row justify-between items-center z-10 absolute");
    			add_location(div3, file, 67, 1, 1590);
    			attr_dev(a0, "href", "https://www.frontendpractice.com/projects/backstage-talks");
    			add_location(a0, file, 102, 3, 2472);
    			attr_dev(div4, "class", "font-sans font-semibold text-xl text-center underline pointer-events-auto hover:font-bold");
    			add_location(div4, file, 99, 2, 2359);
    			attr_dev(a1, "href", "#section5");
    			attr_dev(a1, "class", "hover:font-bold");
    			add_location(a1, file, 109, 5, 2690);
    			attr_dev(li0, "class", "w-28");
    			add_location(li0, file, 108, 4, 2667);
    			attr_dev(a2, "href", "#section4");
    			attr_dev(a2, "class", "hover:font-bold");
    			add_location(a2, file, 112, 5, 2786);
    			attr_dev(li1, "class", "w-28");
    			add_location(li1, file, 111, 4, 2763);
    			attr_dev(a3, "href", "#section3");
    			attr_dev(a3, "class", "hover:font-bold");
    			add_location(a3, file, 115, 5, 2882);
    			attr_dev(li2, "class", "w-28");
    			add_location(li2, file, 114, 4, 2859);
    			attr_dev(a4, "href", "#section2");
    			attr_dev(a4, "class", "hover:font-bold");
    			add_location(a4, file, 118, 5, 2978);
    			attr_dev(li3, "class", "w-28");
    			add_location(li3, file, 117, 4, 2955);
    			attr_dev(a5, "href", "#section1");
    			attr_dev(a5, "class", "hover:font-bold");
    			add_location(a5, file, 121, 5, 3074);
    			attr_dev(li4, "class", "w-28");
    			add_location(li4, file, 120, 4, 3051);
    			add_location(ul, file, 107, 3, 2658);
    			attr_dev(div5, "class", "font-sans font-semibold text-xl text-center pointer-events-auto");
    			add_location(div5, file, 106, 2, 2577);
    			attr_dev(div6, "class", "min-w-full p-6 flex flex-row justify-between items-end z-100 absolute bottom-0 left-0 pointer-events-none");
    			add_location(div6, file, 96, 1, 2233);
    			attr_dev(main, "class", "scrollsnap-container min-w-full min-h-screen scroll-smooth");
    			add_location(main, file, 61, 0, 1399);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(main, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t5);
    			append_dev(main, div6);
    			append_dev(div6, div4);
    			append_dev(div4, a0);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t9);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(ul, t11);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(ul, t13);
    			append_dev(ul, li3);
    			append_dev(li3, a4);
    			append_dev(ul, t15);
    			append_dev(ul, li4);
    			append_dev(li4, a5);
    			/*main_binding*/ ctx[7](main);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "resize", /*onwindowresize*/ ctx[6]),
    					listen_dev(
    						main,
    						"scroll",
    						function () {
    							if (is_function(!/*isScrolling*/ ctx[2] ? /*parseScroll*/ ctx[5] : null)) (!/*isScrolling*/ ctx[2] ? /*parseScroll*/ ctx[5] : null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						main,
    						"mousemove",
    						function () {
    							if (is_function(!/*isScrolling*/ ctx[2] ? /*parseScroll*/ ctx[5] : null)) (!/*isScrolling*/ ctx[2] ? /*parseScroll*/ ctx[5] : null).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*bgColour*/ 8) {
    				set_style(div0, "background-color", /*bgColour*/ ctx[3]);
    			}

    			if (dirty & /*sections*/ 16) {
    				each_value = [.../*sections*/ ctx[4]].reverse();
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(main, t5);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			/*main_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let sections = [
    		{
    			id: 1,
    			image: 'red',
    			alt: '',
    			colour: '#00c1b5'
    		},
    		{
    			id: 2,
    			image: 'blue',
    			alt: '',
    			colour: '#ff651a'
    		},
    		{
    			id: 3,
    			image: 'yellow',
    			alt: '',
    			colour: '#ffbe00'
    		},
    		{
    			id: 4,
    			image: 'orange',
    			alt: '',
    			colour: '#1d3fbb'
    		},
    		{
    			id: 5,
    			image: 'turquoise',
    			alt: '',
    			colour: '#e30512'
    		}
    	];

    	let box;
    	let yTop = 0;
    	let yBottom = 0;
    	let yHeight = 0;
    	let innerHeight;
    	let lastScroll = 0;
    	let isScrolling = false;
    	const colours = sections.map(section => section.colour);
    	let bgColour = '#00c1b5';

    	let changeBGColour = () => {
    		$$invalidate(2, isScrolling = true);

    		if (yTop >= 0 && yTop > lastScroll) {
    			for (let index = 0; index < sections.length; index++) {
    				if (lastScroll <= innerHeight * index) {
    					$$invalidate(3, bgColour = colours[index]);
    					break;
    				}
    			}
    		} else if (yTop < lastScroll) {
    			for (let index = 0; index < sections.length; index++) {
    				if (lastScroll < innerHeight * (index + 1)) {
    					$$invalidate(3, bgColour = colours[index]);
    					break;
    				}
    			}
    		}

    		lastScroll = yTop;
    		$$invalidate(2, isScrolling = false);
    	};

    	let parseScroll = () => {
    		yTop = box.scrollTop;
    		yBottom = yTop + innerHeight;
    		yHeight = box.scrollHeight;
    		changeBGColour();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(1, innerHeight = window.innerHeight);
    	}

    	function main_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			box = $$value;
    			$$invalidate(0, box);
    		});
    	}

    	$$self.$capture_state = () => ({
    		sections,
    		box,
    		yTop,
    		yBottom,
    		yHeight,
    		innerHeight,
    		lastScroll,
    		isScrolling,
    		colours,
    		bgColour,
    		changeBGColour,
    		parseScroll
    	});

    	$$self.$inject_state = $$props => {
    		if ('sections' in $$props) $$invalidate(4, sections = $$props.sections);
    		if ('box' in $$props) $$invalidate(0, box = $$props.box);
    		if ('yTop' in $$props) yTop = $$props.yTop;
    		if ('yBottom' in $$props) yBottom = $$props.yBottom;
    		if ('yHeight' in $$props) yHeight = $$props.yHeight;
    		if ('innerHeight' in $$props) $$invalidate(1, innerHeight = $$props.innerHeight);
    		if ('lastScroll' in $$props) lastScroll = $$props.lastScroll;
    		if ('isScrolling' in $$props) $$invalidate(2, isScrolling = $$props.isScrolling);
    		if ('bgColour' in $$props) $$invalidate(3, bgColour = $$props.bgColour);
    		if ('changeBGColour' in $$props) changeBGColour = $$props.changeBGColour;
    		if ('parseScroll' in $$props) $$invalidate(5, parseScroll = $$props.parseScroll);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		box,
    		innerHeight,
    		isScrolling,
    		bgColour,
    		sections,
    		parseScroll,
    		onwindowresize,
    		main_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
