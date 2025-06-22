
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
	'use strict';

	/** @returns {void} */
	function noop() {}

	/** @returns {void} */
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

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	let src_url_equal_anchor;

	/**
	 * @param {string} element_src
	 * @param {string} url
	 * @returns {boolean}
	 */
	function src_url_equal(element_src, url) {
		if (element_src === url) return true;
		if (!src_url_equal_anchor) {
			src_url_equal_anchor = document.createElement('a');
		}
		// This is actually faster than doing URL(..).href
		src_url_equal_anchor.href = url;
		return element_src === src_url_equal_anchor.href;
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	/** @type {typeof globalThis} */
	const globals =
		typeof window !== 'undefined'
			? window
			: typeof globalThis !== 'undefined'
			? globalThis
			: // @ts-ignore Node typings have this
			  global;

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @returns {void} */
	function destroy_each(iterations, detaching) {
		for (let i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detaching);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @returns {void} */
	function set_style(node, key, value, important) {
		if (value == null) {
			node.style.removeProperty(key);
		} else {
			node.style.setProperty(key, value, important ? 'important' : '');
		}
	}

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
	 * @returns {CustomEvent<T>}
	 */
	function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
		return new CustomEvent(type, { detail, bubbles, cancelable });
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
	 *
	 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs/svelte#onmount
	 * @template T
	 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
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

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
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

	/** @returns {void} */
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

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	const outroing = new Set();

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	// general each functions:

	function ensure_array_like(array_like_or_iterator) {
		return array_like_or_iterator?.length !== undefined
			? array_like_or_iterator
			: Array.from(array_like_or_iterator);
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	// TODO: Document the other params
	/**
	 * @param {SvelteComponent} component
	 * @param {import('./public.js').ComponentConstructorOptions} options
	 *
	 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
	 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
	 * This will be the `add_css` function from the compiled component.
	 *
	 * @returns {void}
	 */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles = null,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
			fragment: null,
			ctx: [],
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
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
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
				// TODO: what is the correct type here?
				// @ts-expect-error
				const nodes = children(options.target);
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify

	/**
	 * The current version, as set in package.json.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-version
	 * @type {string}
	 */
	const VERSION = '4.2.20';
	const PUBLIC_VERSION = '4';

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @returns {void}
	 */
	function dispatch_dev(type, detail) {
		document.dispatchEvent(custom_event(type, { version: VERSION, ...detail }, { bubbles: true }));
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append_dev(target, node) {
		dispatch_dev('SvelteDOMInsert', { target, node });
		append(target, node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert_dev(target, node, anchor) {
		dispatch_dev('SvelteDOMInsert', { target, node, anchor });
		insert(target, node, anchor);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach_dev(node) {
		dispatch_dev('SvelteDOMRemove', { node });
		detach(node);
	}

	/**
	 * @param {Node} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @param {boolean} [has_prevent_default]
	 * @param {boolean} [has_stop_propagation]
	 * @param {boolean} [has_stop_immediate_propagation]
	 * @returns {() => void}
	 */
	function listen_dev(
		node,
		event,
		handler,
		options,
		has_prevent_default,
		has_stop_propagation,
		has_stop_immediate_propagation
	) {
		const modifiers =
			options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
		if (has_prevent_default) modifiers.push('preventDefault');
		if (has_stop_propagation) modifiers.push('stopPropagation');
		if (has_stop_immediate_propagation) modifiers.push('stopImmediatePropagation');
		dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
		const dispose = listen(node, event, handler, options);
		return () => {
			dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
			dispose();
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr_dev(node, attribute, value) {
		attr(node, attribute, value);
		if (value == null) dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
		else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
	}

	function ensure_array_like_dev(arg) {
		if (
			typeof arg !== 'string' &&
			!(arg && typeof arg === 'object' && 'length' in arg) &&
			!(typeof Symbol === 'function' && arg && Symbol.iterator in arg)
		) {
			throw new Error('{#each} only works with iterable values.');
		}
		return ensure_array_like(arg);
	}

	/**
	 * @returns {void} */
	function validate_slots(name, slot, keys) {
		for (const slot_key of Object.keys(slot)) {
			if (!~keys.indexOf(slot_key)) {
				console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
			}
		}
	}

	/**
	 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
	 *
	 * Can be used to create strongly typed Svelte components.
	 *
	 * #### Example:
	 *
	 * You have component library on npm called `component-library`, from which
	 * you export a component called `MyComponent`. For Svelte+TypeScript users,
	 * you want to provide typings. Therefore you create a `index.d.ts`:
	 * ```ts
	 * import { SvelteComponent } from "svelte";
	 * export class MyComponent extends SvelteComponent<{foo: string}> {}
	 * ```
	 * Typing this makes it possible for IDEs like VS Code with the Svelte extension
	 * to provide intellisense and to use the component like this in a Svelte file
	 * with TypeScript:
	 * ```svelte
	 * <script lang="ts">
	 * 	import { MyComponent } from "component-library";
	 * </script>
	 * <MyComponent foo={'bar'} />
	 * ```
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 * @template {Record<string, any>} [Slots=any]
	 * @extends {SvelteComponent<Props, Events>}
	 */
	class SvelteComponentDev extends SvelteComponent {
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Props}
		 */
		$$prop_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Events}
		 */
		$$events_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Slots}
		 */
		$$slot_def;

		/** @param {import('./public.js').ComponentConstructorOptions<Props>} options */
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error("'target' is a required option");
			}
			super();
		}

		/** @returns {void} */
		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn('Component was already destroyed'); // eslint-disable-line no-console
			};
		}

		/** @returns {void} */
		$capture_state() {}

		/** @returns {void} */
		$inject_state() {}
	}

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	/* src\App.svelte generated by Svelte v4.2.20 */

	const { window: window_1 } = globals;
	const file = "src\\App.svelte";

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[18] = list[i].id;
		child_ctx[19] = list[i].image;
		child_ctx[20] = list[i].alt;
		return child_ctx;
	}

	// (142:1) {#each [...sections].reverse() as { id, image, alt }}
	function create_each_block(ctx) {
		let section;
		let div;
		let img;
		let img_src_value;
		let t0;
		let h3;

		const block = {
			c: function create() {
				section = element("section");
				div = element("div");
				img = element("img");
				t0 = space();
				h3 = element("h3");
				h3.textContent = `Section #${/*id*/ ctx[18]}`;
				attr_dev(img, "class", "rounded-lg w-96 image");
				if (!src_url_equal(img.src, img_src_value = "images/image-" + /*image*/ ctx[19] + ".jpg")) attr_dev(img, "src", img_src_value);
				attr_dev(img, "alt", /*alt*/ ctx[20]);
				add_location(img, file, 144, 4, 3328);
				attr_dev(div, "class", "drop-shadow-2xl mix-blend-hard-light");
				add_location(div, file, 143, 3, 3272);
				attr_dev(h3, "class", "p-1 font-sans text-xl font-bold md:p-3");
				add_location(h3, file, 150, 3, 3441);
				attr_dev(section, "id", "section" + /*id*/ ctx[18]);
				add_location(section, file, 142, 2, 3241);
			},
			m: function mount(target, anchor) {
				insert_dev(target, section, anchor);
				append_dev(section, div);
				append_dev(div, img);
				append_dev(section, t0);
				append_dev(section, h3);
			},
			p: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(section);
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block.name,
			type: "each",
			source: "(142:1) {#each [...sections].reverse() as { id, image, alt }}",
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
		add_render_callback(/*onwindowresize*/ ctx[8]);
		let each_value = ensure_array_like_dev([.../*sections*/ ctx[4]].reverse());
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
				attr_dev(div0, "class", "absolute z-0 min-w-full min-h-full bgDisplay");
				set_style(div0, "background-color", /*bgColour*/ ctx[3]);
				set_style(div0, "transition", `background-color 1s`);
				add_location(div0, file, 104, 0, 2385);
				attr_dev(h1, "class", "font-sans text-3xl font-bold uppercase content-text md:text-5xl");
				add_location(h1, file, 130, 3, 2944);
				add_location(div1, file, 129, 2, 2934);
				attr_dev(div2, "class", "font-sans font-bold content-text");
				add_location(div2, file, 136, 2, 3076);
				attr_dev(div3, "class", "absolute z-10 flex flex-row items-center justify-between min-w-full p-1 md:p-3");
				add_location(div3, file, 126, 1, 2832);
				attr_dev(a0, "href", "https://www.frontendpractice.com/projects/backstage-talks");
				add_location(a0, file, 162, 3, 3807);
				attr_dev(div4, "class", "font-sans font-semibold text-center underline pointer-events-auto content-text hover:font-bold");
				add_location(div4, file, 159, 2, 3686);
				attr_dev(a1, "href", "#section5");
				attr_dev(a1, "class", "hover:font-bold");
				add_location(a1, file, 171, 5, 4048);
				attr_dev(li0, "class", "md:w-28");
				add_location(li0, file, 170, 4, 4021);
				attr_dev(a2, "href", "#section4");
				attr_dev(a2, "class", "hover:font-bold");
				add_location(a2, file, 174, 5, 4150);
				attr_dev(li1, "class", "md:w-28");
				add_location(li1, file, 173, 4, 4123);
				attr_dev(a3, "href", "#section3");
				attr_dev(a3, "class", "hover:font-bold");
				add_location(a3, file, 177, 5, 4252);
				attr_dev(li2, "class", "md:w-28");
				add_location(li2, file, 176, 4, 4225);
				attr_dev(a4, "href", "#section2");
				attr_dev(a4, "class", "hover:font-bold");
				add_location(a4, file, 180, 5, 4354);
				attr_dev(li3, "class", "md:w-28");
				add_location(li3, file, 179, 4, 4327);
				attr_dev(a5, "href", "#section1");
				attr_dev(a5, "class", "hover:font-bold");
				add_location(a5, file, 183, 5, 4456);
				attr_dev(li4, "class", "md:w-28");
				add_location(li4, file, 182, 4, 4429);
				add_location(ul, file, 169, 3, 4011);
				attr_dev(div5, "class", "font-sans font-semibold text-center pointer-events-auto content-text");
				add_location(div5, file, 166, 2, 3916);
				attr_dev(div6, "class", "absolute bottom-0 left-0 flex flex-row items-end justify-between min-w-full p-1 pointer-events-none md:p-3 z-100");
				add_location(div6, file, 156, 1, 3550);
				attr_dev(main, "id", "content");
				attr_dev(main, "class", "min-w-full min-h-full scrollsnap-container scroll-smooth");
				add_location(main, file, 111, 0, 2547);
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
					if (each_blocks[i]) {
						each_blocks[i].m(main, null);
					}
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
				/*main_binding*/ ctx[9](main);

				if (!mounted) {
					dispose = [
						listen_dev(window_1, "resize", /*onwindowresize*/ ctx[8]),
						listen_dev(main, "scroll", /*scroll_handler*/ ctx[10], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*bgColour*/ 8) {
					set_style(div0, "background-color", /*bgColour*/ ctx[3]);
				}

				if (dirty & /*sections*/ 16) {
					each_value = ensure_array_like_dev([.../*sections*/ ctx[4]].reverse());
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
				if (detaching) {
					detach_dev(div0);
					detach_dev(t0);
					detach_dev(main);
				}

				destroy_each(each_blocks, detaching);
				/*main_binding*/ ctx[9](null);
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
				image: "red",
				alt: "Exterior of a red tiled building with a window in the center covered with white blinds.",
				colour: "#00c1b5"
			},
			{
				id: 2,
				image: "blue",
				alt: "Exterior of a blue building.",
				colour: "#ff651a"
			},
			{
				id: 3,
				image: "yellow",
				alt: "An upward view to a skylight within a triangular building.",
				colour: "#ffbe00"
			},
			{
				id: 4,
				image: "orange",
				alt: "A window with a balcony railing on a house with an orange exterior. The railing holds three orange planting pots containing different succulents.",
				colour: "#1d3fbb"
			},
			{
				id: 5,
				image: "turquoise",
				alt: "A white building against a clear, light teal sky.",
				colour: "#e30512"
			}
		];

		let box;
		let yTop = 0;
		let yBottom = 0;
		let innerHeight = 0;
		let lastTop = 0;
		let lastBottom = 0;
		let isScrolling = false;
		let sectionIndex = 0;
		const colours = sections.map(section => section.colour);
		let bgColour = "#00c1b5";

		let changeBGColour = () => {
			if (yTop >= 0 && yTop >= lastTop) {
				// Scrolling down
				for (let index = 1; index < colours.length; index++) {
					if (yTop <= innerHeight * index) {
						$$invalidate(3, bgColour = colours[index]);
						sectionIndex = index;
						break;
					}
				}
			} else if (yTop <= lastTop) {
				// Scrolling up
				for (let index = 0; index < colours.length - 1; index++) {
					if (yTop < innerHeight * (index + 1)) {
						$$invalidate(3, bgColour = colours[index]);
						sectionIndex = index;
						break;
					}
				}
			}

			lastTop = yTop;
			lastBottom = yBottom;
			$$invalidate(2, isScrolling = false);
		};

		let parseScroll = () => {
			yTop = Math.floor(box.scrollTop);
			yBottom = Math.floor(yTop + innerHeight);
		};

		let whiteText = () => {
			let content = document.getElementById("content");

			sectionIndex >= 3
			? content.classList.add("text-white")
			: content.classList.remove("text-white");
		};

		const appHeight = () => {
			document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
		};

		onMount(() => {
			window.addEventListener("resize", appHeight);
			appHeight();

			// Cleanup on destroy
			return () => {
				window.removeEventListener("resize", appHeight);
			};
		});

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
		});

		function onwindowresize() {
			$$invalidate(1, innerHeight = window_1.innerHeight);
		}

		function main_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				box = $$value;
				$$invalidate(0, box);
			});
		}

		const scroll_handler = () => {
			if (!isScrolling) {
				$$invalidate(2, isScrolling = true);
				parseScroll();

				setTimeout(
					() => {
						changeBGColour();
						whiteText();
					},
					100
				);
			}
		};

		$$self.$capture_state = () => ({
			onMount,
			sections,
			box,
			yTop,
			yBottom,
			innerHeight,
			lastTop,
			lastBottom,
			isScrolling,
			sectionIndex,
			colours,
			bgColour,
			changeBGColour,
			parseScroll,
			whiteText,
			appHeight
		});

		$$self.$inject_state = $$props => {
			if ('sections' in $$props) $$invalidate(4, sections = $$props.sections);
			if ('box' in $$props) $$invalidate(0, box = $$props.box);
			if ('yTop' in $$props) yTop = $$props.yTop;
			if ('yBottom' in $$props) yBottom = $$props.yBottom;
			if ('innerHeight' in $$props) $$invalidate(1, innerHeight = $$props.innerHeight);
			if ('lastTop' in $$props) lastTop = $$props.lastTop;
			if ('lastBottom' in $$props) lastBottom = $$props.lastBottom;
			if ('isScrolling' in $$props) $$invalidate(2, isScrolling = $$props.isScrolling);
			if ('sectionIndex' in $$props) sectionIndex = $$props.sectionIndex;
			if ('bgColour' in $$props) $$invalidate(3, bgColour = $$props.bgColour);
			if ('changeBGColour' in $$props) $$invalidate(5, changeBGColour = $$props.changeBGColour);
			if ('parseScroll' in $$props) $$invalidate(6, parseScroll = $$props.parseScroll);
			if ('whiteText' in $$props) $$invalidate(7, whiteText = $$props.whiteText);
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
			changeBGColour,
			parseScroll,
			whiteText,
			onwindowresize,
			main_binding,
			scroll_handler
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
	});

	return app;

})();
//# sourceMappingURL=bundle.js.map
