<template>
  <div>
    <header>
      <slot name="header" title="Header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer" text="1234"></slot>
    </footer>
  </div>
</template>
