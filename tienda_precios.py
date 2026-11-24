import sqlite3
import tkinter as tk
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from pathlib import Path
from tkinter import messagebox, ttk


DATABASE_PATH = Path(__file__).with_name("datos_tienda.db")
CENTAVO = Decimal("0.01")


def parse_amount(value: str, field_name: str) -> Decimal:
    normalized = value.strip().replace(",", ".")
    try:
        amount = Decimal(normalized)
    except InvalidOperation as error:
        raise ValueError(f"Escribe un número válido en «{field_name}».") from error

    if not amount.is_finite():
        raise ValueError(f"Escribe un número válido en «{field_name}».")
    return amount


def format_money(amount: Decimal) -> str:
    return f"${amount.quantize(CENTAVO, rounding=ROUND_HALF_UP):,.2f}"


class PriceCalculator:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("Calculadora de precios para mi tienda")
        self.root.geometry("760x560")
        self.root.minsize(650, 480)
        self.selected_product_id: int | None = None

        try:
            self.connection = sqlite3.connect(DATABASE_PATH)
            self.connection.execute(
                """
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    cost TEXT NOT NULL,
                    profit_percent TEXT NOT NULL
                )
                """
            )
            self.connection.commit()
        except sqlite3.Error as error:
            messagebox.showerror(
                "Error al abrir los datos",
                f"No se pudo abrir o crear la base de datos:\n{error}",
                parent=root,
            )
            root.destroy()
            raise

        self.name_var = tk.StringVar()
        self.cost_var = tk.StringVar()
        self.profit_var = tk.StringVar(value="30")
        self.result_var = tk.StringVar(value="Precio de venta: —")
        self.profit_amount_var = tk.StringVar(value="Ganancia por unidad: —")

        self._build_interface()
        self._load_products()
        self.root.protocol("WM_DELETE_WINDOW", self._close)

    def _build_interface(self) -> None:
        main = ttk.Frame(self.root, padding=18)
        main.pack(fill="both", expand=True)

        ttk.Label(
            main,
            text="Calculadora de precios",
            font=("TkDefaultFont", 18, "bold"),
        ).pack(anchor="w")
        ttk.Label(
            main,
            text="El porcentaje de ganancia se calcula sobre el costo del producto.",
        ).pack(anchor="w", pady=(2, 14))

        form = ttk.LabelFrame(main, text="Datos del producto", padding=12)
        form.pack(fill="x")
        form.columnconfigure(1, weight=1)

        ttk.Label(form, text="Nombre:").grid(row=0, column=0, sticky="w", padx=(0, 8), pady=5)
        name_entry = ttk.Entry(form, textvariable=self.name_var)
        name_entry.grid(row=0, column=1, sticky="ew", pady=5)

        ttk.Label(form, text="Costo por unidad ($):").grid(
            row=1, column=0, sticky="w", padx=(0, 8), pady=5
        )
        ttk.Entry(form, textvariable=self.cost_var).grid(row=1, column=1, sticky="ew", pady=5)

        ttk.Label(form, text="Ganancia sobre el costo (%):").grid(
            row=2, column=0, sticky="w", padx=(0, 8), pady=5
        )
        ttk.Entry(form, textvariable=self.profit_var).grid(
            row=2, column=1, sticky="ew", pady=5
        )

        results = ttk.Frame(form)
        results.grid(row=3, column=0, columnspan=2, sticky="ew", pady=(9, 0))
        ttk.Label(results, textvariable=self.result_var, font=("TkDefaultFont", 12, "bold")).pack(
            anchor="w"
        )
        ttk.Label(results, textvariable=self.profit_amount_var).pack(anchor="w", pady=(3, 0))

        actions = ttk.Frame(main)
        actions.pack(fill="x", pady=10)
        ttk.Button(actions, text="Calcular", command=self._calculate).pack(side="left")
        ttk.Button(actions, text="Guardar producto", command=self._save_product).pack(
            side="left", padx=(8, 0)
        )
        ttk.Button(actions, text="Nuevo / Limpiar", command=self._clear_form).pack(
            side="left", padx=(8, 0)
        )
        ttk.Button(actions, text="Eliminar seleccionado", command=self._delete_product).pack(
            side="right"
        )

        product_frame = ttk.LabelFrame(main, text="Productos guardados", padding=8)
        product_frame.pack(fill="both", expand=True)
        product_frame.columnconfigure(0, weight=1)
        product_frame.rowconfigure(0, weight=1)

        columns = ("name", "cost", "profit", "price")
        self.products_tree = ttk.Treeview(
            product_frame,
            columns=columns,
            show="headings",
            selectmode="browse",
        )
        self.products_tree.heading("name", text="Producto")
        self.products_tree.heading("cost", text="Costo")
        self.products_tree.heading("profit", text="Ganancia")
        self.products_tree.heading("price", text="Precio de venta")
        self.products_tree.column("name", width=220, anchor="w")
        for column in columns[1:]:
            self.products_tree.column(column, width=130, anchor="e")
        self.products_tree.grid(row=0, column=0, sticky="nsew")

        scrollbar = ttk.Scrollbar(
            product_frame, orient="vertical", command=self.products_tree.yview
        )
        scrollbar.grid(row=0, column=1, sticky="ns")
        self.products_tree.configure(yscrollcommand=scrollbar.set)
        self.products_tree.bind("<<TreeviewSelect>>", self._select_product)
        name_entry.focus_set()

    def _read_form(self) -> tuple[str, Decimal, Decimal]:
        name = self.name_var.get().strip()
        if not name:
            raise ValueError("Escribe el nombre del producto.")

        cost = parse_amount(self.cost_var.get(), "costo")
        profit_percent = parse_amount(self.profit_var.get(), "ganancia")
        if cost <= 0:
            raise ValueError("El costo debe ser mayor que cero.")
        if profit_percent < 0:
            raise ValueError("La ganancia no puede ser negativa.")
        return name, cost, profit_percent

    def _calculate(self) -> tuple[Decimal, Decimal] | None:
        try:
            _, cost, profit_percent = self._read_form()
        except ValueError as error:
            messagebox.showwarning("Revisa los datos", str(error), parent=self.root)
            return None

        profit = (cost * profit_percent / Decimal("100")).quantize(
            CENTAVO, rounding=ROUND_HALF_UP
        )
        price = (cost + profit).quantize(CENTAVO, rounding=ROUND_HALF_UP)
        self.result_var.set(f"Precio de venta: {format_money(price)}")
        self.profit_amount_var.set(f"Ganancia por unidad: {format_money(profit)}")
        return price, profit

    def _save_product(self) -> None:
        try:
            name, cost, profit_percent = self._read_form()
        except ValueError as error:
            messagebox.showwarning("Revisa los datos", str(error), parent=self.root)
            return

        try:
            if self.selected_product_id is None:
                self.connection.execute(
                    "INSERT INTO products (name, cost, profit_percent) VALUES (?, ?, ?)",
                    (name, str(cost), str(profit_percent)),
                )
            else:
                self.connection.execute(
                    """
                    UPDATE products
                    SET name = ?, cost = ?, profit_percent = ?
                    WHERE id = ?
                    """,
                    (name, str(cost), str(profit_percent), self.selected_product_id),
                )
            self.connection.commit()
        except sqlite3.Error as error:
            self.connection.rollback()
            messagebox.showerror(
                "No se pudo guardar",
                f"Hubo un problema al guardar el producto:\n{error}",
                parent=self.root,
            )
            return

        self._load_products()
        self._clear_form()

    def _load_products(self) -> None:
        try:
            rows = self.connection.execute(
                """
                SELECT id, name, cost, profit_percent
                FROM products
                ORDER BY name COLLATE NOCASE, id
                """
            ).fetchall()
        except sqlite3.Error as error:
            messagebox.showerror(
                "No se pudieron cargar los productos",
                f"Hubo un problema al leer los datos:\n{error}",
                parent=self.root,
            )
            return

        for item in self.products_tree.get_children():
            self.products_tree.delete(item)

        for product_id, name, cost_text, profit_text in rows:
            cost = Decimal(cost_text)
            profit_percent = Decimal(profit_text)
            profit = (cost * profit_percent / Decimal("100")).quantize(
                CENTAVO, rounding=ROUND_HALF_UP
            )
            price = cost + profit
            self.products_tree.insert(
                "",
                "end",
                iid=str(product_id),
                values=(
                    name,
                    format_money(cost),
                    f"{profit_percent}% ({format_money(profit)})",
                    format_money(price),
                ),
            )

    def _select_product(self, _event: tk.Event) -> None:
        selection = self.products_tree.selection()
        if not selection:
            return

        product_id = int(selection[0])
        try:
            row = self.connection.execute(
                "SELECT name, cost, profit_percent FROM products WHERE id = ?",
                (product_id,),
            ).fetchone()
        except sqlite3.Error as error:
            messagebox.showerror(
                "No se pudo abrir el producto",
                f"Hubo un problema al leer los datos:\n{error}",
                parent=self.root,
            )
            return

        if row is None:
            return
        self.selected_product_id = product_id
        self.name_var.set(row[0])
        self.cost_var.set(row[1])
        self.profit_var.set(row[2])
        self._calculate()

    def _delete_product(self) -> None:
        selection = self.products_tree.selection()
        if not selection:
            messagebox.showinfo(
                "Selecciona un producto",
                "Primero selecciona en la lista el producto que quieres eliminar.",
                parent=self.root,
            )
            return

        product_id = int(selection[0])
        product_name = self.products_tree.item(selection[0], "values")[0]
        if not messagebox.askyesno(
            "Confirmar eliminación",
            f"¿Quieres eliminar «{product_name}»?",
            parent=self.root,
        ):
            return

        try:
            self.connection.execute("DELETE FROM products WHERE id = ?", (product_id,))
            self.connection.commit()
        except sqlite3.Error as error:
            self.connection.rollback()
            messagebox.showerror(
                "No se pudo eliminar",
                f"Hubo un problema al eliminar el producto:\n{error}",
                parent=self.root,
            )
            return

        self._load_products()
        self._clear_form()

    def _clear_form(self) -> None:
        self.products_tree.selection_remove(self.products_tree.selection())
        self.selected_product_id = None
        self.name_var.set("")
        self.cost_var.set("")
        self.profit_var.set("30")
        self.result_var.set("Precio de venta: —")
        self.profit_amount_var.set("Ganancia por unidad: —")

    def _close(self) -> None:
        self.connection.close()
        self.root.destroy()


def main() -> None:
    root = tk.Tk()
    PriceCalculator(root)
    root.mainloop()


if __name__ == "__main__":
    main()
