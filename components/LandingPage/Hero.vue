<template>

  <header
    class="px-4 py-12 w-full z-2 md:px-6 md:py-16"
    aria-label="Hero section"
  >

    <section
      aria-labelledby="hero-heading"
      class="flex flex-col  gap-8 justify-between items-center mx-auto w-full max-w-8xl"
    >

      <div
        class="flex flex-col gap-2 w-full items-center justify-center *:text-center"
      >
        <h1
          id="hero-heading"
          class="text-4xl font-bold z-2"
        >

          <span class="relative">
            Code
            <UIcon
              name="lucide:code"
              class="absolute -top-2 left-6.5 size-5 animate-[floating-icon_10s_ease-in-out_infinite]"
            />
          </span> Documentation and Sharing <br> Your own way!

         
        </h1>

        <p class="text-base text-muted z-2">
          Effortlessly organize, document, and share your code snippets.
        </p>

      </div>

      <div class="flex gap-4 flex-wrap justify-center items-center w-full">
        
        <UButton
          color="primary"
          variant="solid"
          icon="lucide:rocket"
          to="/auth"
          size="lg"
        >
          Get Started
        </UButton>

        <UButton
          color="neutral"
          variant="outline"
          icon="lucide:book"
          to="/documentation"
          size="lg"
        >
          Read Documentation
        </UButton>
        
      </div>

    </section>

  </header>

</template>

<style>
 @keyframes floating-icon {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.5rem);
    }
  }
</style>
