<script setup>
import { ref, onMounted } from 'vue';

const inputText = ref('');
const simplifiedText = ref(''); // Added comment to force rebuild
const message = ref('Hallo van de frontend!');
const backendMessage = ref('');
const selectedLanguage = ref('Dutch'); // New ref for selected language
const selectedTargetAudience = ref('Algemeen'); // New ref for selected target audience
const selectedOutputFormat = ref('Samenvatting'); // New ref for selected output format

async function fetchBackendMessage() {
  try {
    const response = await fetch('/api/hello');
    const data = await response.json();
    backendMessage.value = data.message;
  } catch (error) {
    console.error('Fout bij ophalen backend bericht:', error);
    backendMessage.value = 'Fout bij ophalen bericht van backend.';
  }
}

async function simplifyText() {
  try {
    const response = await fetch('/api/simplify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: inputText.value, language: selectedLanguage.value, targetAudience: selectedTargetAudience.value, outputFormat: selectedOutputFormat.value }), // Pass selected language, target audience, and output format
    });
    const data = await response.json();
    if (response.ok) {
      simplifiedText.value = data.simplifiedText;
    } else {
      simplifiedText.value = `Fout: ${data.error}`;
    }
  } catch (error) {
    console.error('Fout bij vereenvoudigen tekst:', error);
    simplifiedText.value = 'Niet gelukt om tekst te vereenvoudigen.';
  }
}

onMounted(fetchBackendMessage);
</script>

<template>
  <div>
    <h1>MensentaalMachine</h1>

    <label for="language-select">Selecteer Taal:</label>
    <select id="language-select" v-model="selectedLanguage">
      <option value="Dutch">Nederlands</option>
      <option value="English">Engels</option>
      <option value="French">Frans</option>
    </select>
    <br>

    <label for="target-audience-select">Doelgroep:</label>
    <select id="target-audience-select" v-model="selectedTargetAudience">
      <option value="Algemeen">Algemeen</option>
      <option value="Jongeren">Jongeren</option>
      <option value="Ouderen">Ouderen</option>
    </select>
    <br>

    <label for="output-format-select">Output Formaat:</label>
    <select id="output-format-select" v-model="selectedOutputFormat">
      <option value="Samenvatting">Samenvatting</option>
      <option value="Korte versie (Instagram-achtig)">Korte versie (Instagram-achtig)</option>
      <option value="Medium versie (LinkedIn-achtig)">Medium versie (LinkedIn-achtig)</option>
      <option value="Opsommingstekens">Opsommingstekens</option>
    </select>
    <br>

    <textarea v-model="inputText" placeholder="Voer hier complexe Nederlandse tekst in..." rows="10" cols="50"></textarea>
    <br>
    <button @click="simplifyText">Vereenvoudig Tekst</button>

    <h2>Vereenvoudigde Tekst:</h2>
    <p>{{ simplifiedText }}</p>
  </div>
</template>

<style scoped>
/* You can keep or remove existing styles as needed */
</style>