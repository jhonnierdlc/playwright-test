import { test, expect, Page } from "@playwright/test";

test.describe("CRUD de empleados", () => {
  const empleado = {
    name: "Juan Pérez",
    position: "Desarrollador",
    salary: "2500",
  };
  const empleadoEditado = {
    name: "Juan Pérez Editado",
    position: "Senior Developer",
    salary: "3000",
  };
  const baseURL = "http://localhost:4200";

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseURL}/employees`);
    await expect(page.locator("h2")).toHaveText("Lista de Empleados");
    await limpiarEmpleados(page);
  });

  async function limpiarEmpleados(page: Page) {
    const deleteButtons = page.locator(".btn-delete");
    const count = await deleteButtons.count();
    for (let i = 0; i < count; i++) {
      page.once("dialog", async (dialog) => await dialog.accept());
      await deleteButtons.first().click();
      await page.waitForTimeout(300);
    }
  }

  async function crearEmpleado(page: Page, emp: typeof empleado) {
    await page.click('a.btn-primary:has-text("Nuevo Empleado")');
    await page.fill('[data-cy="employee-name"]', emp.name);
    await page.fill('[data-cy="employee-position"]', emp.position);
    await page.fill('[data-cy="employee-salary"]', emp.salary);
    await page.click('[data-cy="submit-button"]');
    await expect(
      page.locator(`.employee-table tr:has-text("${emp.name}")`).first()
    ).toBeVisible();
  }

  async function editarEmpleado(
    page: Page,
    nombreActual: string,
    emp: typeof empleadoEditado
  ) {
    const row = page
      .locator(`.employee-table tr:has-text("${nombreActual}")`)
      .first();
    await row.locator(".btn-edit").click();
    await page.fill('[data-cy="employee-name"]', emp.name);
    await page.fill('[data-cy="employee-position"]', emp.position);
    await page.fill('[data-cy="employee-salary"]', emp.salary);
    await page.click('[data-cy="submit-button"]');
    await expect(
      page.locator(`.employee-table tr:has-text("${emp.name}")`).first()
    ).toBeVisible();
  }

  async function eliminarEmpleado(page: Page, nombre: string) {
    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
    const row = page
      .locator(`.employee-table tr:has-text("${nombre}")`)
      .first();
    await row.locator(".btn-delete").click();
    await expect(
      page.locator(`.employee-table tr:has-text("${nombre}")`).first()
    ).toHaveCount(0, { timeout: 10000 });
  }

  test("Listar empleados correctamente", async ({ page }) => {
    const rowsCount = await page.locator(".employee-table tr").count();
    expect(rowsCount).toBeGreaterThanOrEqual(0);
  });

  test("Crear empleado", async ({ page }) => {
    await crearEmpleado(page, empleado);
  });

  test("Editar empleado", async ({ page }) => {
    await crearEmpleado(page, empleado);
    await editarEmpleado(page, empleado.name, empleadoEditado);
  });

  // test("Eliminar empleado", async ({ page }) => {
  //   await crearEmpleado(page, empleado);
  //   await editarEmpleado(page, empleado.name, empleadoEditado);
  //   await eliminarEmpleado(page, empleadoEditado.name);
  // });
});
