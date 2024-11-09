- Łatwiej jest oceniać treść niż generować
- Wiele modeli nie radzi sobie z wykonywaniem zadań, których treść jest w formacie innym niż naturalny język (yaml, json)
Lepiej jest yrozbi zadanie na transformacje danych, a następnie ich ocenę/odpowiedź
- W prompcie oceniającym bardzo wskazane jest dodanie przestrzeni na "zastanowienie się". Możemy to zrobić albo poprzez oczekiwanie formatu JSON, albo poprzez format widoczny poniżej. Polega on na zastosowaniu tagów `<thinking>` oraz `<result>`, w których model może wpisać oczekiwaną treść, a następnie z pomocą wyrażenia regularnego możemy pobrać rezultat. W bloku `<thinking>` model generując uzasadnienie, stopniowo zwiększa prawdopodobieństwo tego, że kolejne tokeny będą wygenerowane zgodnie z naszymi zasadami. Ważne tu jest dodawanie przykładów z blokiem `<thinking>` aby "pokazać" modelowi jak ma myśleć.

Optymalizacja aplikacji:
- Jak możemy zaprojektować logikę, aby realizować jak najwięcej zapytań równolegle?
- Czy możemy skorzystać z mniejszego, szybszego modelu, nawet kosztem bardziej obszernych promptów?
- Czy możemy skorzystać z mechanizmu cache'owania promptu w celu zmniejszenia czasu reakcji (np. w przypadku modeli Anthropic)?
- Czy możemy skorzystać z platform oferujących szybką inferencję?
- Czy w ogóle będzie zależało nam na wydajności, bo np. część z zadań mo
- Czy wszystkie z zadań musi realizować model i czy możemy przynajmniej część logiki, przenieść na kod (np. przez wyrażenia regularne)?