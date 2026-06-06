import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  text: {
    marginBottom: 4,
  },
  section: {
    marginBottom: 16,
  },
});

export function RecipePDF({ recipe }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{recipe.title}</Text>

        <Text style={styles.text}>{recipe.description}</Text>

        <View style={styles.section}>
          <Text>
            Cuisine: {recipe.cuisine} | Category: {recipe.category}
          </Text>

          <Text>
            Time: {parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} mins
          </Text>

          <Text>Servings: {recipe.servings}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, i) => (
            <Text key={i} style={styles.text}>
              • {ingredient.item} – {ingredient.amount}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Instructions</Text>
          {recipe.instructions.map((step) => (
            <View key={step.step} style={{ marginBottom: 6 }}>
              <Text>
                {step.step}. {step.title}
              </Text>

              <Text>{step.instruction}</Text>
            </View>
          ))}
        </View>

        {recipe.tips?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Chef&apos;s Tips</Text>
            {recipe.tips.map((tip, i) => (
              <Text key={i}>• {tip}</Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
