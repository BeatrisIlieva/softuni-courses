from typing import List
from project.task import Task


class Section:
    def __init__(self, name: str):
        self.name = name
        self.tasks: List[Task] = []

    def add_task(self, new_task: Task) -> str:
        if new_task in self.tasks:
            return f"Task is already in the section {self.name}"

        self.tasks.append(new_task)

        return f"Task {new_task.details()} is added to the section"

    def complete_task(self, task_name: str) -> str:
        try:
            task = next(filter(lambda t: t.name == task_name, self.tasks))
        except StopIteration:
            return f"Could not find task with the name {task_name}"

        task.completed = True

        return f"Completed task {task_name}"

    def clean_section(self) -> str:
        count = 0

        for task in self.tasks:
            if task.completed:
                count += 1
                self.tasks.remove(task)

        return f"Cleared {count} tasks."

    def view_section(self) -> str:
        first_message_part = f"Section {self.name}:"

        second_message_part = "\n".join([f"{t.details()}" for t in self.tasks])

        return "\n".join([first_message_part, second_message_part])


task = Task("Make bed", "27/05/2020")
print(task.change_name("Go to University"))
print(task.change_due_date("28.05.2020"))
task.add_comment("Don't forget laptop")
print(task.edit_comment(0, "Don't forget laptop and notebook"))
print(task.details())
section = Section("Daily tasks")
print(section.add_task(task))
second_task = Task("Make bed",
"27/05/2020")
section.add_task(second_task)
print(section.clean_section())
print(section.view_section())
