/**
 * Сделано задание на звездочку
 * Реализованы методы LinkedList.prev и LinkedList.next
 */

export const isStar = true;

class LinkedListItem<T> {
    value: T;
    next: LinkedListItem<T> | null = null;
    prev: LinkedListItem<T> | null = null;
    constructor(value: T) {
        this.value = value;
    }
}

export class LinkedList<TItem> {
    private _head: LinkedListItem<TItem> | null = null;
    private _tail: LinkedListItem<TItem> | null = null;
    private _pointer: LinkedListItem<TItem> | null = null;
    private _size: number;
    private _isCallingPrevOrNext = false;

    constructor() {
        this._size = 0;
    }

    /* Количество элементов в списке */
    public get size(): number {
        return this._size;
    }

    /**
     * Вставляет элемент в конец списка
     * @param{TItem} value - вставляемый элемент
     */
    public push(value: TItem): void {
        const node = new LinkedListItem<TItem>(value);
        if (!this._tail) {
            this._head = this._tail = this._pointer = node;
        } else {
            this._tail.next = node;
            node.prev = this._tail;
            this._tail = node;
        }
        this._size++;
    }

    /* Извлекает последний элемент списка и возвращает его,
       либо undefined, если список пуст */
    public pop(): TItem|undefined {
        if (!this._tail) {
            return;
        }
        const temp: LinkedListItem<TItem> = this._tail;
        if (this._pointer && !this._pointer.next) {
            this.prev();
        }
        this._tail = this._tail.prev;
        if (this._tail) {
            this._tail.next = null;
        } else {
            this._head = null;
        }
        this._size--;

        return temp.value;
    }

    public get(index: number): TItem|undefined {
        if (index >= this.size || index < 0) {
            return;
        }
        let element = this._head;
        for (let i = 1; i <= index && element; i++) {
            element = element.next;
        }

        return element ? element.value : undefined;
    }

    /**
     * Вставляет элемент в начало списка
     * @param{TItem} value - вставляемый элемент
     */
    public unshift(value: TItem): void {
        const node = new LinkedListItem<TItem>(value);
        if (!this._head) {
            this._head = this._tail = this._pointer = node;
        } else {
            this._head.prev = node;
            node.next = this._head;
            this._head = node;
        }
        if (!this._isCallingPrevOrNext) {
            this._pointer = this._head;
        }
        this._size++;
    }

    /* Извлекает первый элемент списка и возвращает его,
       либо undefined, если список пуст */
    public shift(): TItem|undefined {
        if (!this._head) {
            return;
        }
        if (this._pointer && !this._pointer.prev) {
            this.next();
        }
        const temp: LinkedListItem<TItem> = this._head;
        this._head = this._head.next;
        if (this._head) {
            this._head.prev = null;
        } else {
            this._tail = null;
        }
        this._size--;

        return temp.value;
    }

    /* Возвращает текущий элемент списка, на который указывает указатель,
       либо undefined, если список пуст.
       Устанавливает указатель на следующий элемент, если такой есть */
    public next(): TItem|undefined {
        return this.movePointer('next');
    }

    /* Возвращает текущий элемент списка, на который указывает указатель,
       либо undefined, если список пуст.
       Устанавливает указатель на предыдущий элемент, если такой есть */
    public prev(): TItem | undefined {
        return this.movePointer('prev');
    }

    private movePointer(direction: 'prev' | 'next'): TItem|undefined {
        this._isCallingPrevOrNext = true;
        if (this._pointer === null || this._size === 0) {
            return;
        }
        const temp: LinkedListItem<TItem> = this._pointer;
        this._pointer = direction === 'prev' ? this._pointer.prev : this._pointer.next;

        return temp.value;
    }
}

class RingBufferItem<T> {
    value: T;
    next: RingBufferItem<T>| null = null;
    constructor(value: T) {
        this.value = value;
    }
}

export class RingBuffer<TItem> {
    private readonly _capacity: number;
    private _size: number;
    private _head: RingBufferItem<TItem> | null = null;
    private _tail: RingBufferItem<TItem> | null = null;

    constructor(capacity: number) {
        this._capacity = capacity;
        this._size = 0;
    }

    /**
     * Возвращает элемент коллекции расположенный по указанному индексу,
     либо undefined, если индекс находится вне границ буфера
     * @param{number} index - индекс
     * @returns{TItem|undefined}
     */
    public get(index: number): TItem|undefined {
        if (index >= this.size || index < 0) {
            return;
        }
        let element = this._head;
        for (let i = 1; i <= index && element; i++) {
            element = element.next;
        }

        return element ? element.value : undefined;
    }

    /**
     * Вставляет элемент в конец коллекции
     * @param{TItem} value - вставляемый элемент
     */
    public push(value: TItem): void {
        if (!this.capacity) {
            return;
        }
        if (this.size === this.capacity) {
            this.shift();
        }
        if (!this._head) {
            this._tail = this._head = new RingBufferItem<TItem>(value);
        } else if (this._tail) {
            const item = new RingBufferItem<TItem>(value);
            this._tail.next = item;
            this._tail = item;
        }
        this._size++;
    }

    /* Извлекает первый элемент из коллекции и возвращает его,
        либо undefined, если буфер пуст */
    public shift(): TItem|undefined {
        if (!this._head) {
            return;
        }
        const result = this._head.value;
        this._head = this._head.next;
        if (!this._head) {
            this._tail = null;
        }
        this._size--;

        return result;
    }

    /* Вместимость буфера */
    public get capacity(): number {
        return this._capacity;
    }

    /* Количество элементов в буфере */
    public get size(): number {
        return this._size;
    }

    /* Возвращает новый буфер состоящий из элементов buffer1, buffer2, ...
    с общей вместимостью равной сумме вместимостей переданных буферов */
    public static concat<U>(...buffers: Array<RingBuffer<U>>): RingBuffer<U> {
        const sumCapacity = buffers.reduce((sum, current) => sum + current.capacity, 0);
        const newBuffer: RingBuffer<U> = new RingBuffer<U>(sumCapacity);
        const allItems: U[] = buffers.reduce((items: U[], current) => {
            let item: U|undefined = current.get(0);
            for (let i = 1; i <= current.size && item !== undefined; i++) {
                items.push(item);
                item = current.get(i);
            }

            return items;
        }, []);
        allItems.forEach(item => newBuffer.push(item));

        return newBuffer;
    }
}

class QueueItem<TItem> {
    value: TItem;
    next: QueueItem<TItem>| null = null;
    constructor(value: TItem) {
        this.value = value;
    }
}

export class Queue<TItem> {
    private _size: number;
    private _head: QueueItem<TItem> | null = null;
    private _tail: QueueItem<TItem> | null = null;

    constructor() {
        this._size = 0;
    }

    /**
     * Добавляет элемент в очередь
     * @param{TItem} value
     */
    public enqueue(value: TItem): void {
        if (!this._head) {
            this._tail = this._head = new QueueItem<TItem>(value);
        } else if (this._tail) {
            const item = new QueueItem<TItem>(value);
            this._tail.next = item;
            this._tail = item;
        }
        this._size++;
    }

    /* Извлекает элемент из очереди,
       либо возвращает undefined, если очередь пуста*/
    public dequeue(): TItem|undefined {
        if (!this._head) {
            return;
        }
        const result = this._head.value;
        this._head = this._head.next;
        if (!this._head) {
            this._tail = null;
        }
        this._size--;

        return result;
    }

    /* Количество элементов в очереди */
    public get size(): number {
        return this._size;
    }

    /* Возвращает элемент очереди расположенный по указанному индексу,
       либо undefined, если индекс находится вне границ буфера */
    public get(index: number): TItem|undefined {
        if (index >= this.size || index < 0) {
            return;
        }
        index = this.size - index - 1;
        let element = this._head;
        for (let i = 1; i <= index && element; i++) {
            element = element.next;
        }

        return element ? element.value : undefined;
    }
}

enum Priority {
    high = 3,
    middle = 2,
    low = 1
}

export class PriorityQueue<TItem> {
    private _highPriorityQueue = new Queue<TItem>();
    private _middlePriorityQueue = new Queue<TItem>();
    private _lowPriorityQueue = new Queue<TItem>();

    /* Количество элементов в очереди */
    public get size(): number {
        return this._highPriorityQueue.size +
            this._middlePriorityQueue.size +
            this._lowPriorityQueue.size;
    }

    /**
     * Добавляет элемент с приоритетом в очередь
     * @param{TItem} element
     * @param{number} priority
     */
    public enqueue(element: TItem, priority: Priority): void {
        switch (priority) {
            case Priority.high: {
                this._highPriorityQueue.enqueue(element);
                break;
            }
            case Priority.middle: {
                this._middlePriorityQueue.enqueue(element);
                break;
            }
            case Priority.low: {
                this._lowPriorityQueue.enqueue(element);
                break;
            }
            default: {
                return;
            }
        }
    }

    /* Извлекает элемент с наивысшим приоритетом из очереди.
    Если есть несколько элементов с одинаковым приоритетом, извлекается элемент,
    который был помещён в очередь первым (из элементов с наивысшим приоритетом).
    Либо возвращает undefined, если очередь пуста*/
    public dequeue(): TItem|undefined {
        if (this._highPriorityQueue.size) {
            return this._highPriorityQueue.dequeue();
        } else if (this._middlePriorityQueue.size) {
            return this._middlePriorityQueue.dequeue();
        }

        return this._lowPriorityQueue.dequeue();
    }
}

export class HashTable<K, V> {
    private _table: Array<[K, V]>;
    private _size: number;
    constructor() {
        this._size = 0;
        this._table = [];
    }

    public get size(): number {
        return this._size;
    }

    /* Очищает таблицу */
    public clear(): void {
        this._size = 0;
        this._table = new Array<[K, V]>();
    }

    /**
     * Добавляет элемент в словарь по указанному ключу
     * @param{K} key
     * @param{V} element
     */
    public put(key: K, element: V): void {
        const pair = this._table.filter(note => note[0] === key);
        if (pair.length) {
            pair[0][1] = element;
        } else {
            this._table.push([key, element]);
            this._size++;
        }
    }

    /* Возвращает элемент таблицы по указанному ключу,
       либо undefined, если элемент по переданному ключу не существует */
    public get(key: K): V|undefined {
        const pair = this._table.find(note => note[0] === key);

        return pair ? pair[1] : undefined;
    }
}
