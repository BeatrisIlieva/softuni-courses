from encapsulation.wild_cat_zoo.animal import Animal


class Tiger(Animal):
    MONEY_FOR_CARE = 45

    def __init__(self, name: str, gender: str, age: int):
        super().__init__(name, gender, age, self.MONEY_FOR_CARE)
